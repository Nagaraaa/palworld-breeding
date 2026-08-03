"use strict";
/* ==================== MOTEUR PARTAGÉ (main thread + worker) ==================== */
const CORE_SRC = `
function buildCore(PAL_RAW, EXC_RAW, NOCHILD){
  const PALS = {};
  PAL_RAW.split(";").forEach(row => {
    const parts = row.split("|");
    PALS[parts[0]] = { id: parts[0], name: parts[1], p: +parts[2], monster: parts[3]==="m", nobreed: parts[3]==="x" };
  });
  const EXC = {};
  EXC_RAW.split(";").forEach(row => {
    const q = row.split(",");
    EXC[q[0] + "," + q[1]] = q[2];
  });
  const NC = new Set(NOCHILD);
  const ALL_IDS = Object.keys(PALS);
  const PARENTS = ALL_IDS.filter(id => !PALS[id].nobreed);
  const CANDS = ALL_IDS.filter(id => !NC.has(id)).map(id => ({id, p: PALS[id].p})).sort((a,b)=>a.p-b.p);
  const GENDER = { "78.0,79.0": "♀ Wixen × ♂ Katress", "79.0,78.0": "♀ Katress × ♂ Wixen" };
  function breedRank(a, b){
    const avg = (PALS[a].p + PALS[b].p) / 2;
    let best = null, bd = Infinity;
    for (let i = 0; i < CANDS.length; i++){
      const d = Math.abs(CANDS[i].p - avg);
      if (d < bd || (d === bd && best && CANDS[i].p > best.p)){ bd = d; best = CANDS[i]; }
    }
    return best.id;
  }
  function breedAll(a, b){
    if (a === b) return [{ child: a, self: true }];
    if (GENDER[a+","+b]) return [
      { child: EXC[a+","+b], note: GENDER[a+","+b], special: true },
      { child: EXC[b+","+a], note: GENDER[b+","+a], special: true }
    ];
    const e = EXC[a+","+b] !== undefined ? EXC[a+","+b] : EXC[b+","+a];
    if (e !== undefined) return [{ child: e, special: true }];
    return [{ child: breedRank(a, b) }];
  }
  /* index complet : enfant -> liste de paires [a, b, special] */
  function buildIndex(){
    const idx = {};
    for (let i = 0; i < PARENTS.length; i++){
      for (let j = i; j < PARENTS.length; j++){
        const a = PARENTS[i], b = PARENTS[j];
        const rs = breedAll(a, b);
        for (const r of rs){
          (idx[r.child] || (idx[r.child] = [])).push([a, b, r.special ? 1 : 0, r.note || ""]);
        }
      }
    }
    return idx;
  }
  /* fermeture transitive depuis un ensemble possédé : {gen:{id:n}, recipe:{id:[a,b]}} */
  function closure(owned){
    const gen = {}, recipe = {};
    owned.forEach(id => gen[id] = 0);
    let frontier = owned.filter(id => !PALS[id].nobreed), all = frontier.slice(), g = 0;
    while (frontier.length){
      g++;
      const found = [];
      for (let i = 0; i < all.length; i++){
        for (let j = 0; j < all.length; j++){
          if (j < i) continue;
          const a = all[i], b = all[j];
          if (gen[a] < g-1 && gen[b] < g-1) continue; /* déjà traité aux tours précédents */
          const rs = breedAll(a, b);
          for (const r of rs){
            if (!(r.child in gen) && !found.includes(r.child)){
              found.push(r.child); recipe[r.child] = [a, b];
            }
          }
        }
      }
      if (!found.length) break;
      found.forEach(id => gen[id] = g);
      all = all.concat(found.filter(id => !PALS[id].nobreed));
      frontier = found;
    }
    return { gen, recipe };
  }
  return { PALS, EXC, PARENTS, CANDS, breedAll, buildIndex, closure };
}`;
/* instancie le moteur sur le thread principal */
const CORE = (new Function(CORE_SRC + "; return buildCore;"))()(PAL_RAW, EXC_RAW, NOCHILD);
const { PALS, PARENTS, breedAll } = CORE;
const NOCHILD_SET = new Set(NOCHILD);
const ALL_IDS = Object.keys(PALS);

/* ==================== WEB WORKER (index + fermetures hors du thread UI) ==================== */
let INDEX = null;              /* enfant -> [[a,b,special,note],...] */
let indexResolvers = [];
function whenIndexReady(){ return INDEX ? Promise.resolve(INDEX) : new Promise(r => indexResolvers.push(r)); }
let closureSeq = 0, closureCb = null;
let worker = null;
try {
  const wsrc = CORE_SRC + `
    ;const core = buildCore(${JSON.stringify(PAL_RAW)}, ${JSON.stringify(EXC_RAW)}, ${JSON.stringify(NOCHILD)});
    self.onmessage = e => {
      const m = e.data;
      if (m.type === "index") postMessage({ type: "index", idx: core.buildIndex() });
      else if (m.type === "closure") postMessage({ type: "closure", seq: m.seq, res: core.closure(m.owned) });
    };`;
  worker = new Worker(URL.createObjectURL(new Blob([wsrc], { type: "text/javascript" })));
  worker.onmessage = e => {
    const m = e.data;
    if (m.type === "index"){
      INDEX = m.idx;
      indexResolvers.forEach(r => r(INDEX)); indexResolvers = [];
      document.getElementById("workerState").textContent = "index prêt · " + Object.keys(INDEX).length + " pals";
      setTimeout(() => document.getElementById("workerState").textContent = "", 4000);
    } else if (m.type === "closure" && m.seq === closureSeq && closureCb){
      closureCb(m.res);
    }
  };
  worker.onerror = () => { fallbackIndex(); };
  worker.postMessage({ type: "index" });
} catch (err) { fallbackIndex(); }
function fallbackIndex(){
  if (INDEX) return;
  setTimeout(() => {
    INDEX = CORE.buildIndex();
    indexResolvers.forEach(r => r(INDEX)); indexResolvers = [];
  }, 50);
}
function requestClosure(owned, cb){
  closureSeq++; closureCb = cb;
  if (worker){ try { worker.postMessage({ type: "closure", seq: closureSeq, owned }); return; } catch(e){} }
  const seq = closureSeq;
  setTimeout(() => { if (seq === closureSeq) cb(CORE.closure(owned)); }, 10);
}

/* ==================== HELPERS ==================== */
function palNo(id){
  if (id[0] === "M") return "Terraria";
  const [n, v] = id.split(".");
  return "#" + n.padStart(3, "0") + (v === "1" ? "B" : "");
}
function icon(id, cls, size){
  const s = size || 30;
  const name = PALS[id].name;
  return `<img class="${cls||''}" src="https://palworld.kimpton.io/icons/pals/${id}.png" alt="${name}" loading="lazy"
    onerror="this.outerHTML='<span class=&quot;initial ${cls||''}&quot; style=&quot;width:${s}px;height:${s}px&quot;>${name[0]}</span>'">`;
}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* recherche floue : préfixe > mot > inclusion > sous-séquence */
function norm(s){ return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function fuzzyScore(q, name){
  const n = norm(name);
  if (n.startsWith(q)) return 4000 - n.length;
  if (n.split(" ").some(w => w.startsWith(q))) return 3000 - n.length;
  if (n.includes(q)) return 2000 - n.indexOf(q);
  let i = 0;
  for (const ch of n){ if (ch === q[i]) i++; if (i === q.length) return 1000 - n.length; }
  return -1;
}

/* confettis */
const cvs = document.getElementById("confetti"), ctx = cvs.getContext("2d");
function sizeCanvas(){ cvs.width = innerWidth; cvs.height = innerHeight; }
sizeCanvas(); addEventListener("resize", sizeCanvas);
let parts = [], confAnim = null;
function confetti(x, y){
  if (reduceMotion) return;
  const colors = ["#f3ca63", "#5eead4", "#f87171", "#a78bfa", "#4ade80"];
  for (let i = 0; i < 55; i++){
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 6;
    parts.push({ x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v - 3, s: 3+Math.random()*4,
      c: colors[i % colors.length], r: Math.random()*Math.PI, vr: (Math.random()-.5)*.3, life: 70+Math.random()*30 });
  }
  if (!confAnim) tick();
}
function tick(){
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts){
    p.x += p.vx; p.y += p.vy; p.vy += .18; p.r += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*1.6); ctx.restore();
  }
  confAnim = parts.length ? requestAnimationFrame(tick) : null;
}

/* compteur animé */
function countUp(el, target){
  if (reduceMotion){ el.textContent = target.toLocaleString("fr"); return; }
  const t0 = performance.now(), dur = Math.min(700, 200 + target / 8);
  (function f(t){
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(target * e).toLocaleString("fr");
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}

