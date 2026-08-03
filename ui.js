"use strict";
/* ==================== SÉLECTEUR DE PAL ==================== */
const SORTED_IDS = [...ALL_IDS].sort((x, y) => {
  const mx = x[0] === "M", my = y[0] === "M";
  if (mx !== my) return mx ? 1 : -1;
  return parseFloat(x) - parseFloat(y) || x.localeCompare(y);
});
function makePicker(containerId, labelText, onChange, opts = {}){
  const el = document.getElementById(containerId);
  const ids = opts.ids || SORTED_IDS;
  let value = null;
  const inline = !!opts.inline;
  el.classList.toggle("inline", inline);
  el.innerHTML = inline ? `
    <input class="inlineinp" type="text" autocomplete="off" spellcheck="false"
           placeholder="${opts.placeholder || "Rechercher un pal…"}">
    <button class="clearbtn" type="button" title="Effacer">✕</button>
    <div class="dropdown"><div class="optlist"></div></div>` : `
    <label>${labelText}</label>
    <button class="pickbtn" type="button"><span class="ph">${opts.placeholder || "Choisir un pal…"}</span></button>
    <button class="clearbtn" type="button" title="Effacer">✕</button>
    <div class="dropdown">
      <input type="text" placeholder="Rechercher… (recherche floue)">
      <div class="optlist"></div>
    </div>`;
  const dd = el.querySelector(".dropdown"), list = dd.querySelector(".optlist"),
        clearBtn = el.querySelector(".clearbtn"),
        inp = inline ? el.querySelector(".inlineinp") : dd.querySelector("input"),
        btn = inline ? inp : el.querySelector(".pickbtn");
  let selIndex = -1, shown = [];
  function render(filter){
    const f = norm(filter || "");
    if (!f){ shown = ids.slice(); }
    else {
      shown = ids.map(id => ({ id, s: Math.max(fuzzyScore(f, PALS[id].name), palNo(id).toLowerCase().includes(f) ? 1500 : -1) }))
        .filter(o => o.s >= 0).sort((a, b) => b.s - a.s).map(o => o.id);
    }
    selIndex = shown.length ? 0 : -1;
    list.innerHTML = shown.slice(0, 400).map((id, i) =>
      `<div class="opt${i===0?' sel':''}" data-id="${id}">${icon(id)}<span>${PALS[id].name}</span><span class="pw mono">${PALS[id].p}</span><span class="no">${palNo(id)}</span></div>`
    ).join("") || `<div class="opt" style="color:var(--muted)">Aucun résultat</div>`;
  }
  function open(){
    dd.classList.add("open");
    if (!inline){ inp.value = ""; setTimeout(() => inp.focus(), 10); }
    render(inline ? inp.value : "");
  }
  function close(){ dd.classList.remove("open"); }
  function select(id, silent){
    value = id; close();
    if (inline) inp.value = PALS[id].name;
    else btn.innerHTML = `${icon(id, '', 34)}<span>${PALS[id].name}</span><span class="no">${palNo(id)}</span>`;
    el.classList.add("filled");
    if (!silent) onChange(id);
  }
  if (inline){
    inp.addEventListener("focus", open);
    inp.addEventListener("click", () => dd.classList.contains("open") || open());
  } else {
    btn.addEventListener("click", () => dd.classList.contains("open") ? close() : open());
  }
  clearBtn.addEventListener("click", () => {
    value = null; el.classList.remove("filled");
    if (inline){ inp.value = ""; close(); }
    else btn.innerHTML = `<span class="ph">${opts.placeholder || "Choisir un pal…"}</span>`;
    onChange(null);
  });
  inp.addEventListener("input", () => { if (inline && !dd.classList.contains("open")) dd.classList.add("open"); render(inp.value); });
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowDown"){ selIndex = Math.min(selIndex + 1, shown.length - 1); }
    else if (e.key === "ArrowUp"){ selIndex = Math.max(selIndex - 1, 0); }
    else if (e.key === "Enter"){ if (shown[selIndex]) select(shown[selIndex]); return; }
    else if (e.key === "Escape"){ close(); return; }
    else return;
    e.preventDefault();
    list.querySelectorAll(".opt").forEach((o, i) => o.classList.toggle("sel", i === selIndex));
    const s = list.querySelector(".opt.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  });
  list.addEventListener("click", e => {
    const o = e.target.closest(".opt"); if (o && o.dataset.id) select(o.dataset.id);
  });
  document.addEventListener("click", e => { if (!el.contains(e.target)) close(); });
  return { get: () => value, set: (id, silent) => { if (id && PALS[id]) select(id, silent); } };
}

/* barre d'onglets : fond seulement quand on scrolle */
const tabsBar = document.querySelector(".tabs");
function updateTabsBar(){ tabsBar.classList.toggle("scrolled", scrollY > 30); }
addEventListener("scroll", updateTabsBar, { passive: true });
updateTabsBar();
/* ==================== ONGLETS (View Transitions) ==================== */
const TABS = ["home", "want", "breed", "path", "combos", "dex", "passives", "meta", "map", "mine"];
const FAM_ELEVAGE = ["want", "breed", "path", "combos"];
let currentTab = "home";
function syncNav(name){
  const fam = FAM_ELEVAGE.includes(name);
  document.querySelectorAll(".tab").forEach(x =>
    x.classList.toggle("active", fam ? x.dataset.fam === "elevage" : x.dataset.tab === name));
  document.querySelectorAll(".stab").forEach(x => x.classList.toggle("active", x.dataset.tab === name));
  const sub = document.getElementById("subtabs");
  if (sub) sub.classList.toggle("show", fam);
}
function switchTab(name){
  const doIt = () => {
    currentTab = name;
    syncNav(name);
    document.querySelectorAll("section").forEach(x => x.classList.remove("visible"));
    document.getElementById("tab-" + name).classList.add("visible");
    if (name === "mine") initMineTab();
    if (name === "combos") initComboTab();
    if (name === "dex") initPaldexTab();
    if (name === "passives") initPassivesTab();
    if (name === "meta") initMetaTab();
    if (name === "home") setTimeout(runHeroCounters, 150);
    if (name === "map") { initMapTab(); setTimeout(() => { if (typeof mapObj !== "undefined" && mapObj) mapObj.invalidateSize(); }, 300); }
    updateHash();
  };
  if (document.startViewTransition && !reduceMotion && !restoring) document.startViewTransition(doIt);
  else doIt();
}
document.querySelectorAll(".tab, .stab").forEach(t => t.addEventListener("click", () => {
  if (t.dataset.fam === "elevage" && FAM_ELEVAGE.includes(currentTab)) return;
  switchTab(t.dataset.tab);
}));
const logo = document.getElementById("logoHome");
if (logo) logo.addEventListener("click", () => switchTab("home"));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.go)));
let heroDone = false;
function runHeroCounters(){
  if (heroDone) return;
  heroDone = true;
  document.querySelectorAll(".hstat b[data-count]").forEach(el => countUp(el, +el.dataset.count));
}
addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
  const n = parseInt(e.key);
  if (n >= 1 && n <= TABS.length) switchTab(TABS[n - 1]);
});

/* ==================== PERMALIENS ==================== */
let restoring = false;
function updateHash(){
  if (restoring) return;
  const active = currentTab;
  const segs = [active];
  if (active === "breed"){ segs.push(pkA.get() || "", pkB.get() || ""); }
  else if (active === "want"){ segs.push(pkChild.get() || "", pkWith.get() || ""); }
  else if (active === "path"){ segs.push(pkFrom.get() || "", pkTo.get() || ""); }
  history.replaceState(null, "", "#" + segs.join("/").replace(/\/+$/, ""));
}
function restoreHash(){
  const h = location.hash.slice(1);
  if (!h) return;
  const [tab, x, y] = h.split("/");
  if (!TABS.includes(tab)) return;
  restoring = true;
  switchTab(tab);
  if (tab === "breed"){ if (x) pkA.set(x, true); if (y) pkB.set(y, true); updateBreed(); }
  else if (tab === "want"){ if (y) pkWith.set(y, true); if (x) pkChild.set(x, true); if (x) updateParents(); }
  else if (tab === "path"){ if (x) pkFrom.set(x, true); if (y) pkTo.set(y, true); updatePath(); }
  restoring = false;
  updateHash();
}

/* ==================== MES PALS : état persistant ==================== */
let owned = new Set();
try { owned = new Set((JSON.parse(localStorage.getItem("pw_owned") || "[]")).filter(id => PALS[id])); } catch(e){}
function saveOwned(){
  localStorage.setItem("pw_owned", JSON.stringify([...owned]));
  document.getElementById("ownedCnt").textContent = owned.size;
}
document.getElementById("ownedCnt").textContent = owned.size;

/* ==================== 1. CROISER ==================== */
const breedOut = document.getElementById("breedResult");
function childCard(r, reuse){
  const p = PALS[r.child];
  const tags = [];
  if (r.special && !r.note) tags.push(`<span class="tag gold">Combo spécial</span>`);
  if (r.note) tags.push(`<span class="tag gold">${r.note}</span>`);
  if (r.self) tags.push(`<span class="tag">Même espèce : l'enfant est toujours un ${p.name}</span>`);
  if (owned.has(r.child)) tags.push(`<span class="tag" style="color:var(--ok)">déjà dans tes pals</span>`);
  return `<div class="child-card">
    ${icon(r.child, "big", 64)}
    <div>
      <div class="cname">${p.name} <span style="color:var(--muted);font-size:13px">${palNo(r.child)}</span></div>
      <div class="pw">Puissance d'élevage : ${p.p}</div>
      ${tags.length ? `<div>${tags.join("")}</div>` : ""}
    </div>
    ${reuse ? `<div class="usebtns">
      <button class="use-btn" data-use-a="${r.child}">↖ Réutiliser en parent A</button>
      <button class="use-btn" data-use-b="${r.child}">↗ Réutiliser en parent B</button>
    </div>` : ""}
  </div>`;
}
let hatchTimer = null;
function updateBreed(){
  const a = pkA.get(), b = pkB.get();
  clearTimeout(hatchTimer);
  if (!a || !b){ breedOut.innerHTML = ""; updateHash(); return; }
  updateHash();
  const res = breedAll(a, b);
  const showResult = () => {
    breedOut.innerHTML = `<div style="color:var(--muted);font-size:13px;margin-top:6px">Enfant :</div>` +
      res.map(r => childCard(r, true)).join("");
    breedOut.querySelectorAll("[data-use-a]").forEach(x => x.addEventListener("click", () => pkA.set(x.dataset.useA)));
    breedOut.querySelectorAll("[data-use-b]").forEach(x => x.addEventListener("click", () => pkB.set(x.dataset.useB)));
    if (res.some(r => r.special)){
      const rect = breedOut.getBoundingClientRect();
      confetti(rect.left + rect.width / 2, rect.top + 60);
    }
  };
  if (reduceMotion){ showResult(); return; }
  breedOut.innerHTML = `<div class="hatch"><span class="egg">${ico("egg",46)}</span></div>`;
  hatchTimer = setTimeout(showResult, 650);
}
const pkA = makePicker("pkA", "Parent A", updateBreed, { ids: PARENTS });
const pkB = makePicker("pkB", "Parent B", updateBreed, { ids: PARENTS });
document.getElementById("swapAB").addEventListener("click", function(){
  this.classList.toggle("spin");
  const a = pkA.get(), b = pkB.get();
  if (a && b){ pkA.set(b, true); pkB.set(a, true); updateBreed(); }
});

/* ==================== 2. TROUVER LES PARENTS (index instantané + virtualisation) ==================== */
const parentsOut = document.getElementById("parentsResult");
let parentsView = "all";   /* "all" | "owned" */
let renderBatchState = null;
function updateParents(){
  const t = pkChild.get();
  updateHash();
  if (!t){ parentsOut.innerHTML = ""; return; }
  parentsOut.innerHTML = `<div class="skl"></div><div class="skl"></div>`;
  whenIndexReady().then(idx => {
    if (pkChild.get() !== t) return;
    let pairs = (idx[t] || []).slice();
    const w = pkWith.get();
    if (w) pairs = pairs.filter(p => p[0] === w || p[1] === w);
    const isOwnedPair = p => owned.has(p[0]) && owned.has(p[1]);
    const ownedPairs = pairs.filter(isOwnedPair);
    const shown = parentsView === "owned" ? ownedPairs : pairs;
    const selfPair = shown.find(p => p[0] === t && p[1] === t);
    const specials = shown.filter(p => p[2] && !(p[0] === t && p[1] === t));
    const rest = shown.filter(p => !p[2] && !(p[0] === t && p[1] === t));
    const restOwned = rest.filter(isOwnedPair), restOther = rest.filter(p => !isOwnedPair(p));
    let html = "";
    if (!pairs.length){
      parentsOut.innerHTML = `<div class="warnbox">Aucune combinaison ${w ? "avec ce parent " : ""}ne permet d'obtenir <b>${PALS[t].name}</b>${w ? "" : " par croisement. Il faut le capturer ou trouver son œuf"}.</div>`;
      return;
    }
    /* sélecteur Tous / Mes pals */
    html += `<div class="toolrow" style="margin-top:16px">
      <div class="seg">
        <button class="${parentsView === "all" ? "on" : ""}" data-view="all">Tous les combos <span class="cnt2">${pairs.length.toLocaleString("fr")}</span></button>
        <button class="${parentsView === "owned" ? "on" : ""}" data-view="owned">✓ Avec mes pals <span class="cnt2">${ownedPairs.length.toLocaleString("fr")}</span></button>
      </div>
    </div>`;
    if (parentsView === "owned" && !ownedPairs.length){
      html += `<div class="infobox">Aucun combo réalisable avec tes pals cochés pour <b>${PALS[t].name}</b>.
        Coche tes pals (ou importe ta sauvegarde) dans l'onglet <b>Mes Pals</b>, ou repasse sur « Tous les combos ».</div>`;
    } else {
      html += `<div class="count-info"><b><span id="pairCount">0</span></b> combinaison(s) pour obtenir <b style="color:var(--accent)">${PALS[t].name}</b>${w ? ` avec <b>${PALS[w].name}</b>` : ""}${parentsView === "owned" ? ` <span style="color:var(--ok)">réalisables avec tes pals</span>` : ""}${parentsView === "all" && ownedPairs.length ? ` — les <b style="color:var(--ok)">${ownedPairs.length}</b> réalisables avec tes pals sont en tête` : ""} :</div>`;
      if (selfPair) html += `<div class="infobox">${ico("bulb",16)} 2 × <b>${PALS[t].name}</b> donnent toujours un <b>${PALS[t].name}</b>.</div>`;
      html += `<div class="pairgrid" id="pairGrid"></div><div id="pairSentinel"></div>`;
    }
    parentsOut.innerHTML = html;
    parentsOut.querySelectorAll(".seg [data-view]").forEach(b => b.addEventListener("click", () => {
      parentsView = b.dataset.view; updateParents();
    }));
    /* chemin le plus court depuis la collection */
    if (owned.size && !owned.has(t)){
      const box = document.createElement("div");
      box.className = "count-info";
      box.innerHTML = `<button class="togglebtn" id="fromMine">${ico("compass",15)} Chemin le plus court depuis mes pals</button>`;
      parentsOut.appendChild(box);
      document.getElementById("fromMine").addEventListener("click", () => {
        const res = bestPathFromOwned(t);
        const out = document.createElement("div");
        out.className = "planbox";
        if (!res) out.innerHTML = `<h3>Aucun chemin depuis tes pals</h3><div class="count-info">Il te faut d'abord d'autres espèces (capture ou œufs).</div>`;
        else out.innerHTML = `<h3>Depuis ${PALS[res.from].name} — ${res.steps.length} croisement${res.steps.length > 1 ? "s" : ""}</h3>` +
          res.steps.map((s, i) => `<div class="planstep"><span class="num">${i + 1}</span>
            ${icon(s.from, "", 26)}<b>${PALS[s.from].name}</b><span style="color:var(--muted)">✕</span>
            ${icon(s.partner, "", 26)}<b>${PALS[s.partner].name}</b>${owned.has(s.partner) ? " <span style='color:var(--ok);font-size:10px'>✓</span>" : ""}
            <span style="color:var(--accent)">➜</span>${icon(s.child, "", 26)}<b style="color:var(--accent)">${PALS[s.child].name}</b></div>`).join("");
        box.replaceWith(out);
      });
    }
    if (parentsView === "owned" && !ownedPairs.length) return;
    countUp(document.getElementById("pairCount"), shown.length);
    const ordered = [...specials, ...restOwned, ...restOther];
    renderBatchState = { list: ordered, pos: 0, grid: document.getElementById("pairGrid") };
    renderNextBatch();
    const sentinel = document.getElementById("pairSentinel");
    if (sentinel) new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) renderNextBatch();
    }, { rootMargin: "600px" }).observe(sentinel);
  });
}
function renderNextBatch(){
  const st = renderBatchState;
  if (!st || st.pos >= st.list.length) return;
  const batch = st.list.slice(st.pos, st.pos + 160);
  const frag = document.createElement("template");
  frag.innerHTML = batch.map((p, i) => pairChip(p, i)).join("");
  st.grid.appendChild(frag.content);
  st.pos += batch.length;
}
function pairChip(p, i){
  const [a, b, spec, note] = p;
  const both = owned.has(a) && owned.has(b);
  const delay = reduceMotion ? "" : `style="animation-delay:${Math.min(i * 18, 400)}ms"`;
  return `<div class="pairchip${spec ? " special" : ""}${both ? " owned2" : ""}" ${delay}>
    ${icon(a)}<span class="nm">${PALS[a].name}</span>
    <span class="x">✕</span>
    ${icon(b)}<span class="nm">${PALS[b].name}</span>
    ${note ? `<span class="badge">${note}</span>` : (spec ? `<span class="badge">spécial</span>` : (both ? `<span class="badge green">✓ possédés</span>` : ""))}
  </div>`;
}
const pkChild = makePicker("pkChild", "Enfant désiré", updateParents);
const pkWith = makePicker("pkWith", "Avec ce parent (optionnel)", () => updateParents(), { ids: PARENTS, placeholder: "Tous les parents" });

/* recherche de l'accueil : renvoie directement vers "Je veux ce pal" */
const pkHome = makePicker("pkHome", "", id => {
  if (!id) return;
  pkChild.set(id);
  switchTab("want");
}, { inline: true, placeholder: "Rechercher un pal, Lamball, Renjishi, #042…" });

/* ==================== 3. CHEMIN LE PLUS COURT ==================== */
const pathOut = document.getElementById("pathResult");
const adjCache = {};
function adjacency(c){
  if (adjCache[c]) return adjCache[c];
  const m = new Map();
  for (const q of PARENTS){
    for (const r of breedAll(c, q)){
      if (!m.has(r.child)) m.set(r.child, []);
      m.get(r.child).push(q);
    }
  }
  adjCache[c] = m;
  return m;
}
function shortestPath(from, to){
  if (from === to) return [];
  const prev = { [from]: null };
  let frontier = [from];
  while (frontier.length){
    const next = [];
    for (const c of frontier){
      for (const [child, partners] of adjacency(c)){
        if (!(child in prev)){
          prev[child] = { parent: c, partners };
          if (child === to){
            const steps = [];
            let cur = to;
            while (prev[cur]){ steps.unshift({ from: prev[cur].parent, partners: prev[cur].partners, child: cur }); cur = prev[cur].parent; }
            return steps;
          }
          next.push(child);
        }
      }
    }
    frontier = next;
  }
  return null;
}
function updatePath(){
  const f = pkFrom.get(), t = pkTo.get();
  updateHash();
  if (!f || !t){ pathOut.innerHTML = ""; return; }
  pathOut.innerHTML = `<div class="skl"></div>`;
  setTimeout(() => {
    if (pkFrom.get() !== f || pkTo.get() !== t) return;
    if (f === t){ pathOut.innerHTML = `<div class="infobox">C'est le même pal des deux côtés</div>`; return; }
    const steps = shortestPath(f, t);
    if (!steps){
      pathOut.innerHTML = `<div class="warnbox"><b>${PALS[t].name}</b> ne peut pas être obtenu par croisement depuis <b>${PALS[f].name}</b>. Ce pal ne s'obtient qu'en le capturant, via son œuf, ou en croisant 2 parents de la même espèce.</div>`;
      return;
    }
    let html = `<div class="count-info"><b>${steps.length}</b> croisement${steps.length > 1 ? "s" : ""} nécessaire${steps.length > 1 ? "s" : ""} :</div><div class="path">`;
    steps.forEach((s, i) => {
      const sorted = [...s.partners].sort((a, b) => (owned.has(b) ? 1 : 0) - (owned.has(a) ? 1 : 0));
      const partner = sorted[0];
      const others = sorted.length - 1;
      const delay = reduceMotion ? "" : `style="animation-delay:${i * 90}ms"`;
      html += `<div class="step" ${delay}>
        <div class="rail"><div class="dot">${i + 1}</div>${i < steps.length - 1 ? '<div class="line"></div>' : ""}</div>
        <div class="body">
          <div class="steprow">
            ${icon(s.from, '', 36)}<b>${PALS[s.from].name}</b>
            <span class="op">✕</span>
            ${icon(partner, '', 36)}<b>${PALS[partner].name}</b>${owned.has(partner) ? '<span class="own">✓ possédé</span>' : ""}
            <span class="arrow">➜</span>
            ${icon(s.child, '', 36)}<b style="color:var(--accent)">${PALS[s.child].name}</b>
          </div>
          ${others > 0 ? `<div class="altinfo" data-i="${i}">▸ ${others} autre${others > 1 ? "s" : ""} partenaire${others > 1 ? "s" : ""} possible${others > 1 ? "s" : ""}</div>
          <div class="altlist" id="alt${i}">${sorted.slice(1, 60).map(q => `<span class="altchip">${icon(q, '', 22)}${PALS[q].name}${owned.has(q) ? " ✓" : ""}</span>`).join("")}${sorted.length > 61 ? `<span class="altchip">+${sorted.length - 61}…</span>` : ""}</div>` : ""}
        </div>
      </div>`;
    });
    html += `</div>`;
    pathOut.innerHTML = html;
    pathOut.querySelectorAll(".altinfo").forEach(el => el.addEventListener("click", () => {
      const l = document.getElementById("alt" + el.dataset.i);
      l.classList.toggle("open");
      el.textContent = (l.classList.contains("open") ? "▾ " : "▸ ") + el.textContent.slice(2);
    }));
  }, 30);
}
const pkFrom = makePicker("pkFrom", "Pal de départ", updatePath, { ids: PARENTS });
const pkTo = makePicker("pkTo", "Pal recherché", updatePath);
document.getElementById("swapFT").addEventListener("click", function(){
  this.classList.toggle("spin");
  const a = pkFrom.get(), b = pkTo.get();
  if (a && b){ pkFrom.set(b, true); pkTo.set(a, true); updatePath(); }
});

/* meilleur chemin (le plus court) depuis un pal possédé vers une cible */
function bestPathFromOwned(target){
  let best = null;
  for (const from of owned){
    if (PALS[from].nobreed) continue;
    const steps = shortestPath(from, target);
    if (steps && (!best || steps.length < best.steps.length)){
      best = { from, steps: steps.map(s => ({ from: s.from, child: s.child,
        partner: [...s.partners].sort((a, b) => (owned.has(b) ? 1 : 0) - (owned.has(a) ? 1 : 0))[0] })) };
      if (best.steps.length === 1) break;
    }
  }
  return best;
}
/* ==================== 4. MES PALS ==================== */
let mineInit = false, mineDebounce = null;
function initMineTab(){
  if (mineInit){ return; }
  mineInit = true;
  const grid = document.getElementById("mineGrid");
  grid.innerHTML = SORTED_IDS.filter(id => !PALS[id].nobreed).map(id =>
    `<div class="palcell${owned.has(id) ? " owned" : ""}" data-id="${id}" title="${PALS[id].name} ${palNo(id)}">
      ${icon(id, '', 40)}<span class="nm">${PALS[id].name}</span>
    </div>`).join("");
  grid.addEventListener("click", e => {
    const cell = e.target.closest(".palcell"); if (!cell) return;
    const id = cell.dataset.id;
    if (owned.has(id)) owned.delete(id); else owned.add(id);
    cell.classList.toggle("owned", owned.has(id));
    saveOwned(); scheduleMineResults(); if (typeof renderDex === "function" && paldexInit) renderDex();
  });
  document.getElementById("mineSearch").addEventListener("input", function(){
    const f = norm(this.value);
    grid.querySelectorAll(".palcell").forEach(c => {
      c.style.display = !f || fuzzyScore(f, PALS[c.dataset.id].name) >= 0 ? "" : "none";
    });
  });
  document.getElementById("clearOwned").addEventListener("click", () => {
    owned.clear(); collection = {}; saveCollection(); saveOwned();
    grid.querySelectorAll(".palcell.owned").forEach(c => c.classList.remove("owned"));
    scheduleMineResults(); decorateMineCells();
  });
  document.getElementById("resetAll").addEventListener("click", () => {
    if (!confirm("Tout réinitialiser ? (pals cochés, import, token Nitrado mémorisé)")) return;
    Object.keys(localStorage).filter(k => k.startsWith("pw_")).forEach(k => localStorage.removeItem(k));
    location.reload();
  });
  wireImport(); wireNitrado(); decorateMineCells();
  scheduleMineResults();
}
function scheduleMineResults(){
  clearTimeout(mineDebounce);
  mineDebounce = setTimeout(computeMineResults, 250);
}
let lastClosure = null;
function computeMineResults(){
  const out = document.getElementById("mineResults");
  if (owned.size < 2){
    out.innerHTML = owned.size === 0 ? "" : `<div class="infobox" style="margin-top:18px">Coche au moins 2 pals pour voir ce que tu peux obtenir.</div>`;
    return;
  }
  out.innerHTML = `<div class="skl"></div><div class="skl"></div>`;
  requestClosure([...owned], res => {
    lastClosure = res;
    const byGen = {};
    for (const id in res.gen){
      const g = res.gen[id];
      if (g > 0 && !owned.has(id)) (byGen[g] || (byGen[g] = [])).push(id);
    }
    const gens = Object.keys(byGen).map(Number).sort((a, b) => a - b);
    const totalNew = gens.reduce((s, g) => s + byGen[g].length, 0);
    if (!totalNew){ out.innerHTML = `<div class="infobox" style="margin-top:18px">Aucun nouveau pal accessible avec cette sélection.</div>`; return; }
    let html = `<div class="count-info" style="margin-top:20px">${ico("target",16)} <b>${totalNew}</b> nouveau${totalNew > 1 ? "x" : ""} pal${totalNew > 1 ? "s" : ""} accessible${totalNew > 1 ? "s" : ""} par élevage — clique pour voir le plan :</div>`;
    html += `<div id="planTarget"></div>`;
    for (const g of gens){
      html += `<div class="genheader">Génération ${g} — ${byGen[g].length} pal${byGen[g].length > 1 ? "s" : ""} ${g === 1 ? "(croisement direct)" : `(${g} croisements)`}</div><div>`;
      html += byGen[g].sort((a, b) => parseFloat(a) - parseFloat(b)).map(id =>
        `<span class="reachchip" data-plan="${id}">${icon(id, '', 26)}${PALS[id].name}</span>`).join("");
      html += `</div>`;
    }
    const missing = ALL_IDS.filter(id => !(id in res.gen) && !PALS[id].monster);
    html += `<div class="count-info" style="margin-top:16px">Hors de portée : ${missing.length} pals (capture / œufs / mêmes-espèces requis).</div>`;
    out.innerHTML = html;
    out.querySelectorAll("[data-plan]").forEach(chip => chip.addEventListener("click", () => showPlan(chip.dataset.plan)));
  });
}
function showPlan(target){
  const res = lastClosure; if (!res) return;
  const steps = [], done = new Set();
  (function expand(id){
    if (owned.has(id) || done.has(id)) return;
    const rec = res.recipe[id]; if (!rec) return;
    expand(rec[0]); expand(rec[1]);
    done.add(id); steps.push({ a: rec[0], b: rec[1], child: id });
  })(target);
  const box = document.getElementById("planTarget");
  box.innerHTML = `<div class="planbox">
    <h3>Plan d'élevage → ${PALS[target].name} (${steps.length} croisement${steps.length > 1 ? "s" : ""})</h3>
    ${steps.map((s, i) => `<div class="planstep">
      <span class="num">${i + 1}</span>
      ${icon(s.a, '', 26)}<b>${PALS[s.a].name}</b>${owned.has(s.a) ? " <span style='color:var(--ok);font-size:10px'>✓</span>" : ""}
      <span style="color:var(--muted)">✕</span>
      ${icon(s.b, '', 26)}<b>${PALS[s.b].name}</b>${owned.has(s.b) ? " <span style='color:var(--ok);font-size:10px'>✓</span>" : ""}
      <span style="color:var(--accent)">➜</span>
      ${icon(s.child, '', 26)}<b style="color:var(--accent)">${PALS[s.child].name}</b>
    </div>`).join("")}
  </div>`;
  if (box.scrollIntoView) box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
}

/* ==================== 5. COMBOS SPÉCIAUX ==================== */
let comboInit = false;
function initComboTab(){
  if (comboInit) return;
  comboInit = true;
  renderCombos("");
  document.getElementById("comboSearch").addEventListener("input", function(){ renderCombos(norm(this.value)); });
}
function renderCombos(filter){
  const seen = new Set(), specials = [];
  for (const key in CORE.EXC){
    const [a, b] = key.split(","), c = CORE.EXC[key];
    if (a[0] === "M" && b[0] === "M") continue;
    const uk = [a, b].sort().join("|") + ">" + c;
    if (seen.has(uk)) continue;
    seen.add(uk);
    specials.push({ a, b, c, gender: (a === "78.0" && b === "79.0") || (a === "79.0" && b === "78.0") });
  }
  specials.sort((x, y) => parseFloat(x.c) - parseFloat(y.c));
  /* uniques : jamais enfant d'un combo spécial → seulement 2 parents identiques */
  const excChildren = new Set(Object.values(CORE.EXC));
  const uniques = NOCHILD.filter(id => !PALS[id].monster && !PALS[id].nobreed && !excChildren.has(id));
  const match = o => !filter || fuzzyScore(filter, PALS[o.a].name) >= 0 || fuzzyScore(filter, PALS[o.b].name) >= 0 || fuzzyScore(filter, PALS[o.c].name) >= 0;
  const fSpec = specials.filter(match);
  const fUni = uniques.filter(id => !filter || fuzzyScore(filter, PALS[id].name) >= 0);
  let html = `<div class="genheader">${ico("spark",16)} ${fSpec.length} combos spéciaux</div><div class="combolist">`;
  html += fSpec.map((s, i) => `<div class="pairchip special" ${reduceMotion ? "" : `style="animation-delay:${Math.min(i * 15, 350)}ms"`}>
    ${icon(s.a)}<span class="nm">${PALS[s.a].name}</span><span class="x">✕</span>
    ${icon(s.b)}<span class="nm">${PALS[s.b].name}</span><span class="x">➜</span>
    ${icon(s.c)}<span class="nm" style="color:var(--accent)">${PALS[s.c].name}</span>
    ${s.gender ? `<span class="badge">selon genre</span>` : ""}
  </div>`).join("");
  html += `</div><div class="genheader" style="margin-top:24px">${ico("lock",16)} ${fUni.length} pals uniques (seulement 2 parents identiques)</div><div class="combolist">`;
  html += fUni.map(id => `<div class="pairchip">
    ${icon(id)}<span class="nm">${PALS[id].name}</span><span class="x">✕</span>
    ${icon(id)}<span class="nm">${PALS[id].name}</span><span class="x">➜</span>
    ${icon(id)}<span class="nm" style="color:var(--accent)">${PALS[id].name}</span>
  </div>`).join("");
  html += `</div>`;
  document.getElementById("comboContent").innerHTML = html;
}

/* état initial de la navigation */
const startTab = document.querySelector("section.visible");
currentTab = startTab ? startTab.id.replace("tab-", "") : "home";
syncNav(currentTab);
