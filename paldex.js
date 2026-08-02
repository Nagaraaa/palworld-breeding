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
let paldexInit = false, dexFilters = { q: "", elem: "", work: "" };
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
    renderDex();
  }));
  document.getElementById("dexGrid").innerHTML = `<div class="skl"></div><div class="skl"></div><div class="skl"></div>`;
  loadPspPals().then(() => renderDex()).catch(() => {
    document.getElementById("dexGrid").innerHTML = `<div class="warnbox">Impossible de charger les détails des pals (réseau ?). Réessaie plus tard.</div>`;
  });
}
function renderDex(){
  const grid = document.getElementById("dexGrid");
  const ids = SORTED_IDS.filter(id => {
    if (PALS[id].monster) return false;
    const p = pspOf(id);
    if (dexFilters.q && fuzzyScore(dexFilters.q, PALS[id].name) < 0 && !palNo(id).toLowerCase().includes(dexFilters.q)) return false;
    if (dexFilters.elem && !(p && (p.element_types || []).includes(dexFilters.elem))) return false;
    if (dexFilters.work && !(p && p.work_suitability && p.work_suitability[dexFilters.work] > 0)) return false;
    return true;
  });
  document.getElementById("dexCount").textContent = ids.length;
  grid.innerHTML = ids.map((id, i) => {
    const p = pspOf(id) || {};
    const els = (p.element_types || []).map(e =>
      `<span class="elem" style="--c:${ELEM_COLOR[e]}">${ELEM_FR[e]}</span>`).join("");
    const works = Object.entries(p.work_suitability || {}).filter(([, v]) => v > 0)
      .map(([w, v]) => `<span class="wk" title="${WORK_FR[w]} ${v}">${WORK_ICON[w]}<b>${v}</b></span>`).join("");
    return `<div class="dexcard" data-id="${id}" ${reduceMotion ? "" : `style="animation-delay:${Math.min(i * 12, 400)}ms"`}>
      ${icon(id, "", 46)}
      <div class="dexmain">
        <div class="dexname">${PALS[id].name} <span class="no">${palNo(id)}</span></div>
        <div class="dexels">${els}</div>
        ${works ? `<div class="dexwork">${works}</div>` : ""}
      </div>
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
