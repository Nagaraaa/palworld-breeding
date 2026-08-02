"use strict";
/* ==================== PALDEX + PASSIFS ====================
   Données détaillées chargées à la demande depuis le dataset MIT
   palworld-save-pal (https://github.com/oMaN-Rod/palworld-save-pal) via jsDelivr. */

const PSP_BASE = "https://cdn.jsdelivr.net/gh/oMaN-Rod/palworld-save-pal@main/data/json/";

const ELEM_FR = { Normal: "Neutre", Fire: "Feu", Water: "Eau", Electricity: "Foudre",
  Leaf: "Plante", Ice: "Glace", Earth: "Terre", Dark: "Ténèbres", Dragon: "Dragon" };
const ELEM_COLOR = { Normal: "#c9cdd8", Fire: "#f97316", Water: "#38bdf8", Electricity: "#facc15",
  Leaf: "#4ade80", Ice: "#67e8f9", Earth: "#c08457", Dark: "#a78bfa", Dragon: "#f472b6" };
const WORK_FR = { EmitFlame: "Allumage", Watering: "Arrosage", Seeding: "Plantation",
  GenerateElectricity: "Électricité", Handcraft: "Artisanat", Collection: "Récolte",
  Deforest: "Abattage", Mining: "Extraction", OilExtraction: "Pétrole",
  ProductMedicine: "Médicaments", Cool: "Refroidissement", Transport: "Transport", MonsterFarm: "Ranch" };
const WORK_ICON = { EmitFlame: "🔥", Watering: "💧", Seeding: "🌱", GenerateElectricity: "⚡",
  Handcraft: "🔨", Collection: "🧺", Deforest: "🪓", Mining: "⛏️", OilExtraction: "🛢️",
  ProductMedicine: "💊", Cool: "❄️", Transport: "📦", MonsterFarm: "🥚" };
const SIZE_FR = { S: "Petit", M: "Moyen", L: "Grand", XL: "Très grand", None: "—" };

let PSP_PALS = null;               /* tribe -> détails */
let pspPromise = null;
function loadPspPals(){
  if (pspPromise) return pspPromise;
  pspPromise = fetch(PSP_BASE + "pals.json").then(r => r.json()).then(j => {
    PSP_PALS = {};
    /* réindexe par identifiant interne minuscule pour croiser avec CODE2ID */
    for (const k in j) PSP_PALS[k.toLowerCase()] = j[k];
    return PSP_PALS;
  });
  return pspPromise;
}
/* id interne du site (ex "3.0") -> nom interne du jeu (ex "ChickenPal") */
let ID2CODE = null;
function id2code(id){
  if (!ID2CODE){
    ID2CODE = {};
    if (typeof CODE2ID !== "undefined") Object.keys(CODE2ID).forEach(c => { ID2CODE[CODE2ID[c]] = c; });
  }
  return ID2CODE[id] || "";
}
function pspOf(id){ return PSP_PALS ? PSP_PALS[id2code(id).toLowerCase()] : null; }

/* ==================== ONGLET PALDEX ==================== */
/* pals absents du jeu vanilla (non obtenables en partie normale) */
const HORS_VANILLA = new Set(["204.0"]);   /* Astralym */
let paldexInit = false, dexFilters = { q: "", elem: "", work: "", min: 1, sort: "dex" };
function initPaldexTab(){
  if (paldexInit) return;
  paldexInit = true;
  const wrap = document.getElementById("dexFilters");
  wrap.innerHTML = `
    <input type="text" class="searchbar" id="dexSearch" placeholder="Rechercher un pal…" style="margin-top:0">
    <div class="toolrow">
      <div class="chiprow" id="dexElems">
        <button class="chipf on" data-elem="">Tous</button>
        ${Object.keys(ELEM_FR).map(e => `<button class="chipf" data-elem="${e}" style="--c:${ELEM_COLOR[e]}">${ELEM_FR[e]}</button>`).join("")}
      </div>
    </div>
    <div class="toolrow">
      <div class="chiprow" id="dexWorks">
        <button class="chipf on" data-work="">Toutes aptitudes</button>
        ${Object.keys(WORK_FR).map(w => `<button class="chipf" data-work="${w}">${WORK_ICON[w]} ${WORK_FR[w]}</button>`).join("")}
      </div>
    </div>
    <div class="toolrow sortrow">
      <label class="sortlbl">Trier par
        <select id="dexSort">
          <option value="dex">N° Paldeck</option>
          <option value="name">Nom</option>
          <optgroup label="Aptitudes de travail">
            ${Object.keys(WORK_FR).map(w => `<option value="w:${w}">${WORK_ICON[w]} ${WORK_FR[w]} (niveau ↓)</option>`).join("")}
          </optgroup>
          <optgroup label="Statistiques">
            <option value="hp">PV ↓</option><option value="attack">Attaque ↓</option>
            <option value="defense">Défense ↓</option><option value="rarity">Rareté ↓</option>
            <option value="price">Prix ↓</option><option value="breed">Puissance d'élevage ↓</option>
          </optgroup>
        </select>
      </label>
      <label class="sortlbl" id="minWrap" style="display:none">Niveau minimum
        <select id="dexMin">${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}">${n}+</option>`).join("")}</select>
      </label>
    </div>`;
  document.getElementById("dexSearch").addEventListener("input", function(){ dexFilters.q = norm(this.value); renderDex(); });
  wrap.querySelectorAll("[data-elem]").forEach(b => b.addEventListener("click", () => {
    dexFilters.elem = b.dataset.elem;
    wrap.querySelectorAll("[data-elem]").forEach(x => x.classList.toggle("on", x === b));
    renderDex();
  }));
  wrap.querySelectorAll("[data-work]").forEach(b => b.addEventListener("click", () => {
    dexFilters.work = b.dataset.work;
    wrap.querySelectorAll("[data-work]").forEach(x => x.classList.toggle("on", x === b));
    /* choisir une aptitude trie automatiquement par son niveau */
    dexFilters.sort = b.dataset.work ? "w:" + b.dataset.work : "dex";
    document.getElementById("dexSort").value = dexFilters.sort;
    syncMinVisible();
    renderDex();
  }));
  document.getElementById("dexSort").addEventListener("change", function(){
    dexFilters.sort = this.value;
    /* trier par une aptitude filtre implicitement dessus */
    if (this.value.startsWith("w:")){
      dexFilters.work = this.value.slice(2);
      wrap.querySelectorAll("[data-work]").forEach(x => x.classList.toggle("on", x.dataset.work === dexFilters.work));
    }
    syncMinVisible();
    renderDex();
  });
  document.getElementById("dexMin").addEventListener("change", function(){ dexFilters.min = +this.value; renderDex(); });
  document.getElementById("dexGrid").innerHTML = `<div class="skl"></div><div class="skl"></div><div class="skl"></div>`;
  loadPspPals().then(() => renderDex()).catch(() => {
    document.getElementById("dexGrid").innerHTML = `<div class="warnbox">Impossible de charger les détails des pals (réseau ?). Réessaie plus tard.</div>`;
  });
}
function syncMinVisible(){
  const w = document.getElementById("minWrap");
  if (w) w.style.display = dexFilters.work ? "" : "none";
}
function renderDex(){
  const grid = document.getElementById("dexGrid");
  const ids = SORTED_IDS.filter(id => {
    if (PALS[id].monster) return false;
    if (HORS_VANILLA.has(id)) return false;
    const p = pspOf(id);
    if (dexFilters.q && fuzzyScore(dexFilters.q, PALS[id].name) < 0 && !palNo(id).toLowerCase().includes(dexFilters.q)) return false;
    if (dexFilters.elem && !(p && (p.element_types || []).includes(dexFilters.elem))) return false;
    if (dexFilters.work && !(p && p.work_suitability && p.work_suitability[dexFilters.work] >= dexFilters.min)) return false;
    return true;
  });
  /* tri */
  const s = dexFilters.sort;
  const statOf = (id, k) => { const q = pspOf(id) || {}; return k === "breed" ? -PALS[id].p :
    k === "rarity" ? (q.rarity || 0) : k === "price" ? (q.price || 0) : ((q.scaling || {})[k] || 0); };
  if (s.startsWith("w:")){
    const w = s.slice(2);
    ids.sort((a, b) => ((pspOf(b) || {}).work_suitability || {})[w] - ((pspOf(a) || {}).work_suitability || {})[w]
      || parseFloat(a) - parseFloat(b));
  } else if (s === "name") ids.sort((a, b) => PALS[a].name.localeCompare(PALS[b].name));
  else if (s !== "dex") ids.sort((a, b) => statOf(b, s) - statOf(a, s) || parseFloat(a) - parseFloat(b));
  document.getElementById("dexCount").textContent = ids.length;
  grid.innerHTML = ids.map((id, i) => {
    const p = pspOf(id) || {};
    const els = (p.element_types || []).map(e =>
      `<span class="elem" style="--c:${ELEM_COLOR[e]}">${ELEM_FR[e]}</span>`).join("");
    const hi = dexFilters.sort.startsWith("w:") ? dexFilters.sort.slice(2) : null;
    const works = Object.entries(p.work_suitability || {}).filter(([, v]) => v > 0)
      .sort((a, b) => (b[0] === hi ? 1 : 0) - (a[0] === hi ? 1 : 0))
      .map(([w, v]) => `<span class="wk${w === hi ? " hi" : ""}" title="${WORK_FR[w]} niveau ${v}">${WORK_ICON[w]}<b>${v}</b></span>`).join("");
    return `<div class="dexcard" data-id="${id}" ${reduceMotion ? "" : `style="animation-delay:${Math.min(i * 12, 400)}ms"`}>
      ${icon(id, "", 46)}
      <div class="dexmain">
        <div class="dexname">${PALS[id].name} <span class="no">${palNo(id)}</span></div>
        <div class="dexels">${els}</div>
        ${works ? `<div class="dexwork">${works}</div>` : ""}
      </div>
      ${hi ? `<span class="dexrank">#${i + 1}</span>` : ""}
      ${owned.has(id) ? `<span class="dexown" title="Dans ta collection">✓</span>` : ""}
    </div>`;
  }).join("") || `<div class="infobox">Aucun pal ne correspond à ces filtres.</div>`;
  grid.querySelectorAll(".dexcard").forEach(c => c.addEventListener("click", () => showPalSheet(c.dataset.id)));
}
function showPalSheet(id){
  const p = pspOf(id) || {};
  const P = PALS[id];
  const els = (p.element_types || []).map(e => `<span class="elem" style="--c:${ELEM_COLOR[e]}">${ELEM_FR[e]}</span>`).join(" ");
  const works = Object.entries(p.work_suitability || {}).filter(([, v]) => v > 0)
    .map(([w, v]) => `<div class="wrow">${WORK_ICON[w]} ${WORK_FR[w]} <b>${"★".repeat(v)}</b></div>`).join("") || `<div class="wrow" style="color:var(--muted)">Aucune aptitude de travail</div>`;
  const sc = p.scaling || {};
  const tags = [];
  if (p.nocturnal) tags.push("🌙 Nocturne");
  if (p.predator) tags.push("💀 Prédateur");
  if (p.is_boss) tags.push("👑 Alpha");
  if (p.is_tower_boss) tags.push("🗼 Boss de tour");
  if (p.is_raid_boss) tags.push("⚔️ Boss de raid");
  if (p.edible) tags.push("🍖 Comestible");
  const body = `
    <div class="sheet-head">
      ${icon(id, "big", 72)}
      <div>
        <div class="sheet-name">${P.name} <span class="no">${palNo(id)}</span></div>
        <div>${els}</div>
        <div class="sheet-tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </div>
    <div class="sheet-grid">
      <div class="sbox"><div class="slabel">Statistiques de base</div>
        <div class="srow"><span>PV</span><b>${sc.hp ?? "?"}</b></div>
        <div class="srow"><span>Attaque</span><b>${sc.attack ?? "?"}</b></div>
        <div class="srow"><span>Défense</span><b>${sc.defense ?? "?"}</b></div>
        <div class="srow"><span>Rareté</span><b>${p.rarity ?? "?"}</b></div>
        <div class="srow"><span>Taille</span><b>${SIZE_FR[p.size] || "?"}</b></div>
        <div class="srow"><span>Prix marchand</span><b>${p.price ? p.price.toLocaleString("fr") + " or" : "?"}</b></div>
        <div class="srow"><span>Puissance d'élevage</span><b>${P.p}</b></div>
      </div>
      <div class="sbox"><div class="slabel">Aptitudes de travail</div>${works}</div>
    </div>
    <div class="toolrow">
      <button class="togglebtn" data-goto="${id}">🥚 Comment l'obtenir par élevage</button>
      <button class="togglebtn" data-own="${id}">${owned.has(id) ? "✓ Dans ma collection" : "+ Ajouter à ma collection"}</button>
    </div>`;
  openModal(P.name, body);
  const m = document.getElementById("modalBody");
  m.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => {
    closeModal(); switchTab("want"); pkChild.set(b.dataset.goto);
  }));
  m.querySelectorAll("[data-own]").forEach(b => b.addEventListener("click", () => {
    const pid = b.dataset.own;
    if (owned.has(pid)) owned.delete(pid); else owned.add(pid);
    saveOwned(); b.textContent = owned.has(pid) ? "✓ Dans ma collection" : "+ Ajouter à ma collection";
    renderDex();
  }));
}

/* ==================== ONGLET PASSIFS ==================== */
const RANK_FR = { 5: "Divin", 4: "Excellent", 3: "Bon", 2: "Correct", 1: "Basique",
  "-1": "Défaut mineur", "-2": "Mauvais", "-3": "Très mauvais" };
const PASSIVES = PASSIVES_RAW.split("¤").map(row => {
  const [n, r, e] = row.split("|");
  return { n, r: +r, e: e.split("§") };
});
let passInit = false, passFilter = { q: "", rank: "" };
function initPassivesTab(){
  if (passInit) return;
  passInit = true;
  const wrap = document.getElementById("passFilters");
  const ranks = [5, 4, 3, 2, 1, -1, -2, -3];
  wrap.innerHTML = `
    <input type="text" class="searchbar" id="passSearch" placeholder="Rechercher un passif ou un effet (ex. « attaque », « travail »)…" style="margin-top:0">
    <div class="toolrow"><div class="chiprow" id="passRanks">
      <button class="chipf on" data-rank="">Tous</button>
      ${ranks.map(r => `<button class="chipf rk${r > 0 ? r : "n"}" data-rank="${r}">${r > 0 ? "★".repeat(r) : "▼"} ${RANK_FR[r]}</button>`).join("")}
    </div></div>`;
  document.getElementById("passSearch").addEventListener("input", function(){ passFilter.q = norm(this.value); renderPassives(); });
  wrap.querySelectorAll("[data-rank]").forEach(b => b.addEventListener("click", () => {
    passFilter.rank = b.dataset.rank;
    wrap.querySelectorAll("[data-rank]").forEach(x => x.classList.toggle("on", x === b));
    renderPassives();
  }));
  renderPassives();
}
function renderPassives(){
  const list = PASSIVES.filter(p => {
    if (passFilter.rank !== "" && p.r !== +passFilter.rank) return false;
    if (passFilter.q){
      const hay = norm(p.n + " " + p.e.join(" "));
      if (!hay.includes(passFilter.q) && fuzzyScore(passFilter.q, p.n) < 0) return false;
    }
    return true;
  }).sort((a, b) => b.r - a.r || a.n.localeCompare(b.n));
  document.getElementById("passCount").textContent = list.length;
  document.getElementById("passList").innerHTML = list.map((p, i) => `
    <div class="passcard rk${p.r > 0 ? p.r : "n"}" ${reduceMotion ? "" : `style="animation-delay:${Math.min(i * 10, 350)}ms"`}>
      <div class="passhead"><b>${p.n}</b><span class="passrank">${p.r > 0 ? "★".repeat(p.r) : "▼".repeat(-p.r)}</span></div>
      <ul>${p.e.map(x => `<li class="${/-\d|diminue rapidement|reçus|Ne peut|siestes/.test(x) && /-/.test(x) ? "neg" : ""}">${x}</li>`).join("")}</ul>
    </div>`).join("") || `<div class="infobox">Aucun passif ne correspond.</div>`;
}

/* ==================== MODALE PARTAGÉE ==================== */
function openModal(title, html){
  const m = document.getElementById("modal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = html;
  m.classList.add("open");
}
function closeModal(){ document.getElementById("modal").classList.remove("open"); }
document.addEventListener("click", e => {
  if (e.target.id === "modal" || e.target.id === "modalClose") closeModal();
});
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
