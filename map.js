"use strict";
/* ==================== CARTE INTERACTIVE ====================
   Points d'intérêt : dataset MIT palworld-save-pal (oMaN-Rod) via jsDelivr.
   Fonds de carte : tuiles paldb.cc (Palpagos & Arbre-Monde) : repères calés par régression
   sur leurs marqueurs. Si les tuiles ne répondent pas, un fond est généré depuis les POI. */

/* ---- régions : conversion coordonnées sauvegarde -> coordonnées in-game -> pixels carte ---- */
const REGIONS = {
  main: {
    label: "🏝️ Îles Palpagos", tiles: "/api/tile?m=main&z={z}&x={x}&y={y}", img: "map.jpg",
    toGame: (x, y) => ({ x: Math.round((y - 158000) / 459), y: Math.round((x + 123888) / 459) }),
    toPix:  (gx, gy) => [0.16221 * gy - 167.25513, 0.16221 * gx + 311.8397],
    test:   (x, y) => !(x > 400000 && y < -450000)
  },
  tree: {
    label: "🌳 Arbre-Monde", tiles: "/api/tile?m=tree&z={z}&x={x}&y={y}", img: "map-tree.jpg",
    toGame: (x, y) => ({ x: Math.round(y * 0.00074909 + 485.2784), y: Math.round(x * 0.00074853 + 388.8339) }),
    toPix:  (gx, gy) => [2.00281 * gy - 1811.57135, 1.99916 * gx + 255.58671],
    test:   (x, y) => x > 400000 && y < -450000
  }
};
const TILE_BOUNDS = [[-512, 0], [0, 512]];
function savToMap(x, y){ return REGIONS.main.toGame(x, y); }   /* compat */

const ICO = p => "/api/tile?i=" + encodeURIComponent(p);
const MAP_CATS = {
  ft:        { label: "Voyage rapide", icon: "🚩", color: "#5eead4",
               img: ICO("Pal/Texture/UI/InGame/T_icon_compass_FTtower.webp") },
  tower:     { label: "Tours de guet", icon: "🗼", color: "#38bdf8",
               img: ICO("Pal/Texture/UI/InGame/T_icon_compass_FTUnlockMap.webp") },
  towerboss: { label: "Boss de tour", icon: "🏛️", color: "#f472b6",
               img: ICO("Pal/Texture/UI/InGame/T_icon_compass_tower.webp") },
  effigy:    { label: "Statues de Pal Ancien", icon: "🗿", color: "#f3ca63",
               img: ICO("Others/InventoryItemIcon/Texture/T_itemicon_Material_BeastBone_Ancient.webp") },
  dungeon:   { label: "Donjons", icon: "🕳️", color: "#a78bfa", img: ICO("ui/exit-door.svg") },
  alpha:     { label: "Pals Alpha", icon: "👑", color: "#fb923c", pal: true },
  predator:  { label: "Prédateurs", icon: "💀", color: "#f87171", pal: true },
  humanboss: { label: "Boss humains", icon: "🎯", color: "#94a3b8",
               img: ICO("Pal/Texture/UI/InGame/T_icon_compass_00.webp") },
  relic:     { label: "Reliques / bonus", icon: "🔮", color: "#4ade80",
               img: ICO("Others/InventoryItemIcon/Texture/T_itemicon_PalSphere_Legend.webp") }
};
const RELIC_FR = { jump_power: "Puissance de saut", status_ailment_resist: "Résistance aux altérations",
  capture_power: "Puissance de capture", stamina_reduction: "Endurance", hunger_reduction: "Faim",
  glider_speed: "Vitesse du planeur", swim_speed: "Nage", exp_bonus: "Bonus d'XP",
  climb_speed: "Escalade", food_decay_reduction: "Conservation des aliments",
  rainbow_passive_rate: "Taux de passif arc-en-ciel", sphere_homing: "Sphères à tête chercheuse" };

let mapInit = false, mapPOI = null, mapActive = {}, mapObj = null, mapLayers = {},
    mapRegion = "main", mapQuery = "", tileLayer = null, bossNames = null;
/* affichés par défaut : les repères utiles ; les catégories très nombreuses restent à activer */
const CATS_DEFAUT = { ft: true, tower: true, towerboss: true, dungeon: true, alpha: true,
                      effigy: true, predator: true, humanboss: false, relic: false };
try { mapActive = JSON.parse(localStorage.getItem("pw_map_cats3") || "null") || {}; } catch(e){}
Object.keys(MAP_CATS).forEach(k => { if (!(k in mapActive)) mapActive[k] = CATS_DEFAUT[k] !== false; });
try { mapRegion = localStorage.getItem("pw_map_region") || "main"; } catch(e){}
if (!REGIONS[mapRegion] || REGIONS[mapRegion].disabled) mapRegion = "main";

function initMapTab(){
  if (mapInit) return;
  mapInit = true;
  const status = document.getElementById("mapStatus");
  status.innerHTML = `<div class="count-info">🗺️ Chargement de la carte et des points d'intérêt…</div>`;
  Promise.all([loadLeaflet(), loadPOI()]).then(([, poi]) => { mapPOI = poi; buildMapUI(); })
    .catch(err => { status.innerHTML = `<div class="warnbox">Impossible de charger la carte : ${err.message}</div>`; });
}
function loadCss(href){ return new Promise(r => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; l.onload = r; l.onerror = r; document.head.appendChild(l); }); }
function loadJs(src){ return new Promise((r, j) => { const s = document.createElement("script"); s.src = src; s.onload = r; s.onerror = () => j(new Error("script indisponible")); document.head.appendChild(s); }); }
async function loadLeaflet(){
  if (!window.L){
    await loadCss("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css");
    await loadJs("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js");
  }
}
async function loadPOI(){
  const B = PSP_BASE;
  const [ft, eff, mo, rel, bosses] = await Promise.all([
    fetch(B + "fast_travel_points.json").then(r => r.json()),
    fetch(B + "effigies.json").then(r => r.json()),
    fetch(B + "map_objects.json").then(r => r.json()),
    fetch(B + "relics.json").then(r => r.json()),
    fetch(B + "bosses.json").then(r => r.json()).catch(() => [])
  ]);
  const arr = o => Array.isArray(o) ? o : Object.values(o);
  const pts = [];
  const push = (c, x, y, n, extra) => {
    const reg = REGIONS.tree.test(x, y) ? "tree" : "main";
    const g = REGIONS[reg].toGame(x, y);
    pts.push(Object.assign({ c, x, y, n, reg, mx: g.x, my: g.y }, extra || {}));
  };
  /* voyage rapide, tours de guet et tours de boss : liste complète nommée (poi.js) */
  const CAT_FT = { F: "ft", W: "tower", T: "towerboss" };
  if (typeof POI_FT !== "undefined"){
    for (const reg of ["main", "tree"]){
      POI_FT[reg].split("¤").forEach(e => {
        const [t, gx, gy, nom] = e.split("|");
        pts.push({ c: CAT_FT[t], reg, mx: +gx, my: +gy, n: nom, x: 0, y: 0, fixed: true });
      });
    }
  } else {
    arr(ft).forEach(p => {
      const id = p.id || "";
      if (/UnlockMapPoint/.test(p.class || "")) return push("tower", p.x, p.y, "Tour de guet");
      if (/^Boss_|BOSS|LastBoss|_lab$/i.test(id)) return push("towerboss", p.x, p.y, prettyFT(id));
      push("ft", p.x, p.y, prettyFT(id));
    });
  }
  arr(eff).forEach(p => push("effigy", p.x, p.y, "Statue de Pal Ancien"));
  arr(rel).forEach(p => push("relic", p.x, p.y, "Relique : " + (RELIC_FR[p.relic_type] || p.relic_type)));
  /* donjons */
  arr(mo).filter(p => p.type === "dungeon").forEach(p => push("dungeon", p.x, p.y, "Donjon"));
  /* prédateurs : positions de map_objects, nommés via bosses.json */
  const bs = arr(bosses);
  const bkey = o => Math.round(o.x / 100) + "|" + Math.round(o.y / 100);
  const byPos = {};
  bs.forEach(b => { byPos[bkey(b)] = b; });
  const palOf = code => {
    const clean = String(code || "").replace(/^BOSS_|^PREDATOR_|^GYM_/i, "");
    const id = typeof CODE2ID !== "undefined" ? CODE2ID[clean.toLowerCase()] : null;
    return id && typeof PALS !== "undefined" && PALS[id] ? { id, name: PALS[id].name } : null;
  };
  arr(mo).filter(p => p.type === "predator_pal").forEach(p => {
    const b = byPos[bkey(p)];
    const pal = b ? palOf(b.character_id) : null;
    push("predator", p.x, p.y, pal ? "Prédateur " + pal.name : "Prédateur",
      { pid: pal ? pal.id : null, lv: b ? b.level : null });
  });
  /* alphas et boss humains : directement depuis bosses.json (plus complet) */
  const predKeys = new Set(arr(mo).filter(p => p.type === "predator_pal").map(bkey));
  bs.forEach(b => {
    if (predKeys.has(bkey(b))) return;
    const pal = palOf(b.character_id);
    if (pal) push("alpha", b.x, b.y, "Alpha " + pal.name, { pid: pal.id, lv: b.level });
    else {
      const nom = String(b.spawner_id || "").replace(/^BOSS_/i, "").replace(/_/g, " ");
      push("humanboss", b.x, b.y, "Boss : " + (nom || "humain"), { lv: b.level });
    }
  });
  pts.forEach(p => { if (p.fixed) return; const g = REGIONS[p.reg].toGame(p.x, p.y); p.mx = g.x; p.my = g.y; });
  return pts;
}
function prettyFT(id){
  if (!id) return "Point de voyage rapide";
  if (/^WatchTower/.test(id)) return "Tour de guet";
  if (/SkyIsland_BOSS/i.test(id)) return "Tour de l'île céleste";
  if (/WorldTree_LastBoss/i.test(id)) return "Tour finale de l'Arbre-Monde";
  if (/WorldTree_lab/i.test(id)) return "Laboratoire de l'Arbre-Monde";
  if (/^SkyIsland/.test(id)) return "Point de voyage rapide (île céleste)";
  if (/^WorldTree/.test(id)) return "Point de voyage rapide (Arbre-Monde)";
  if (/^Boss_/.test(id)) return "Tour de boss : " + id.replace("Boss_", "");
  return "Point de voyage rapide";
}

/* ---------- fond de secours généré depuis la densité des POI ---------- */
function buildBackdrop(pts){
  const W = 900, H = 900, GW = 200, GH = 200;
  const g = new Float32Array(GW * GH);
  const lats = pts.map(p => p.lat), lngs = pts.map(p => p.lng);
  const minX = Math.min(...lngs) - 20, maxX = Math.max(...lngs) + 20;
  const minY = Math.min(...lats) - 20, maxY = Math.max(...lats) + 20;
  for (const p of pts){
    const cx = Math.round((p.lng - minX) / (maxX - minX) * (GW - 1));
    const cy = Math.round((1 - (p.lat - minY) / (maxY - minY)) * (GH - 1));
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++){
      const x = cx + dx, y = cy + dy;
      if (x >= 0 && y >= 0 && x < GW && y < GH) g[y * GW + x] += Math.exp(-(dx * dx + dy * dy) / 5);
    }
  }
  const tmp = new Float32Array(GW * GH), R = 3;
  for (let pass = 0; pass < 3; pass++){
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++){
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++){ const xx = x + k; if (xx >= 0 && xx < GW){ s += g[y * GW + xx]; n++; } }
      tmp[y * GW + x] = s / n;
    }
    for (let x = 0; x < GW; x++) for (let y = 0; y < GH; y++){
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++){ const yy = y + k; if (yy >= 0 && yy < GH){ s += tmp[yy * GW + x]; n++; } }
      g[y * GW + x] = s / n;
    }
  }
  let mx = 0; for (let i = 0; i < g.length; i++) mx = Math.max(mx, g[i]);
  for (let i = 0; i < g.length; i++) g[i] /= (mx || 1);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#0c1626"; ctx.fillRect(0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){
    const v = g[Math.floor(y / H * GH) * GW + Math.floor(x / W * GW)], i = (y * W + x) * 4;
    if (v > .085){ const t = Math.min(1, (v - .085) / .3); d[i] = 38 + t * 52; d[i+1] = 48 + t * 58; d[i+2] = 58 + t * 60; }
    else if (v > .055){ const t = (v - .055) / .03; d[i] = 18 + t * 22; d[i+1] = 40 + t * 28; d[i+2] = 58 + t * 20; }
  }
  ctx.putImageData(img, 0, 0);
  return { url: cv.toDataURL("image/png"), bounds: [[minY, minX], [maxY, maxX]] };
}

function buildMapUI(){
  const counts = {};
  mapPOI.forEach(p => (counts[p.reg] = counts[p.reg] || {})[p.c] = ((counts[p.reg] || {})[p.c] || 0) + 1);

  document.getElementById("mapFilters").innerHTML = `
    <div class="maptop">
      <div class="regsel" id="mapRegions">
        ${Object.entries(REGIONS).map(([k, r]) =>
          `<button class="regbtn${mapRegion === k ? " on" : ""}" data-reg="${k}">${r.label}</button>`).join("")}
      </div>
      <input type="text" class="mapsearch" id="mapSearch" placeholder="🔍 Rechercher un lieu, un alpha, une relique…">
    </div>
    <div class="legend">
      <div class="legend-head">
        <span class="legend-title">Filtres</span>
        <div class="legend-acts">
          <button class="legbtn" id="mapAll">Tout afficher</button>
          <button class="legbtn" id="mapNone">Tout masquer</button>
        </div>
      </div>
      <div class="legend-grid">
        ${Object.entries(MAP_CATS).map(([k, c]) => `
          <button class="legitem${mapActive[k] ? " on" : ""}" data-cat="${k}" style="--c:${c.color}">
            <span class="legico">${c.img ? `<img src="${c.img}" alt="">` : c.icon}</span>
            <span class="legtxt">${c.label}</span>
            <span class="legcnt" data-cnt="${k}">0</span>
          </button>`).join("")}
      </div>
    </div>`;

  mapObj = L.map("mapCanvas", { crs: L.CRS.Simple, minZoom: 1, maxZoom: 7, zoomSnap: .5, zoomDelta: .5,
    attributionControl: false, maxBounds: TILE_BOUNDS, maxBoundsViscosity: .9, zoomControl: true });
  const info = document.getElementById("mapCoords");
  mapObj.on("mousemove", e => {
    const R = REGIONS[mapRegion];
    const o = R.toPix(0, 0), ux = R.toPix(1, 0)[1] - o[1], uy = R.toPix(0, 1)[0] - o[0];
    info.textContent = `${Math.round((e.latlng.lng - o[1]) / ux)}, ${Math.round((e.latlng.lat - o[0]) / uy)}`;
  });
  /* les marqueurs restent lisibles : on grossit légèrement avec le zoom */
  const sizeByZoom = () => {
    const z = mapObj.getZoom(), el = document.getElementById("mapCanvas");
    el.classList.remove("z-s", "z-m", "z-l");
    el.classList.add(z <= 2 ? "z-s" : z <= 3.5 ? "z-m" : "z-l");
  };
  mapObj.on("zoomend", sizeByZoom);
  setTimeout(sizeByZoom, 100);

  document.querySelectorAll("#mapRegions [data-reg]").forEach(b => b.addEventListener("click", () => {
    if (mapRegion === b.dataset.reg) return;
    mapRegion = b.dataset.reg;
    try { localStorage.setItem("pw_map_region", mapRegion); } catch(e){}
    document.querySelectorAll("#mapRegions [data-reg]").forEach(x => x.classList.toggle("on", x === b));
    switchRegion();
  }));
  document.querySelectorAll(".legend [data-cat]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.cat;
    mapActive[k] = !mapActive[k];
    b.classList.toggle("on", mapActive[k]);
    try { localStorage.setItem("pw_map_cats3", JSON.stringify(mapActive)); } catch(e){}
    applyLayerVisibility();
  }));
  document.getElementById("mapAll").addEventListener("click", () => setAllCats(true));
  document.getElementById("mapNone").addEventListener("click", () => setAllCats(false));
  let deb;
  document.getElementById("mapSearch").addEventListener("input", function(){
    clearTimeout(deb);
    const v = this.value;
    deb = setTimeout(() => { mapQuery = norm(v); buildLayers(); }, 200);
  });
  switchRegion();
}
function setAllCats(v){
  Object.keys(MAP_CATS).forEach(k => mapActive[k] = v);
  document.querySelectorAll(".legend [data-cat]").forEach(b => b.classList.toggle("on", v));
  try { localStorage.setItem("pw_map_cats3", JSON.stringify(mapActive)); } catch(e){}
  applyLayerVisibility();
}
function switchRegion(){
  if (tileLayer){ mapObj.removeLayer(tileLayer); tileLayer = null; }
  mapObj.setMaxBounds([[-560, -50], [50, 560]]);
  mapObj.setView([-256, 256], 1);
  const local = new Image();
  local.onload = () => {
    tileLayer = L.imageOverlay(local.src, TILE_BOUNDS, { opacity: .96, className: "mapbg" }).addTo(mapObj);
    setBgNote("Fond : image locale");
  };
  local.onerror = () => useTiles();
  local.src = REGIONS[mapRegion].img;
  buildLayers();
}
/* une couche par catégorie, créée une seule fois par région/recherche */
function buildLayers(){
  if (!mapObj) return;
  Object.values(mapLayers).forEach(l => { if (mapObj.hasLayer(l)) mapObj.removeLayer(l); });
  mapLayers = {};
  const R = REGIONS[mapRegion];
  const inReg = mapPOI.filter(p => p.reg === mapRegion);
  const counts = {};
  inReg.forEach(p => counts[p.c] = (counts[p.c] || 0) + 1);
  document.querySelectorAll("[data-cnt]").forEach(el => el.textContent = counts[el.dataset.cnt] || 0);

  for (const cat in MAP_CATS){
    const c = MAP_CATS[cat];
    const pts = inReg.filter(p => p.c === cat && (!mapQuery || norm(p.n + " " + c.label).includes(mapQuery)));
    const layer = L.layerGroup();
    for (const p of pts){
      const [lat, lng] = R.toPix(p.mx, p.my);
      const img = (c.pal && p.pid) ? `https://palworld.kimpton.io/icons/pals/${p.pid}.png` : c.img;
      const cls = "pmk" + (c.pal ? " pal" : "");
      const html = img
        ? `<img class="${cls}" src="${img}" alt="" style="--c:${c.color}" onerror="this.outerHTML='<span class=\'${cls} emo\' style=\'--c:${c.color}\'>${c.icon}</span>'">`
        : `<span class="${cls} emo" style="--c:${c.color}">${c.icon}</span>`;
      L.marker([lat, lng], { icon: L.divIcon({ className: "pmkwrap", html, iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14] }), riseOnHover: true })
        .bindPopup(`<b>${p.n}</b>${p.lv ? ` <span class="poplv">Nv.${p.lv}</span>` : ""}
          <br><span class="popc">${c.label} · <b>${p.mx}, ${p.my}</b></span>`)
        .addTo(layer);
    }
    mapLayers[cat] = layer;
  }
  applyLayerVisibility();
}
function applyLayerVisibility(){
  let n = 0;
  for (const cat in mapLayers){
    const l = mapLayers[cat];
    const nb = l.getLayers().length;
    if (mapActive[cat]){
      if (!mapObj.hasLayer(l)) l.addTo(mapObj);
      n += nb;
    } else if (mapObj.hasLayer(l)) mapObj.removeLayer(l);
  }
  const total = mapPOI.filter(p => p.reg === mapRegion).length;
  const st = document.getElementById("mapStatus");
  if (st) st.innerHTML = `<div class="count-info"><b>${n.toLocaleString("fr")}</b> points affichés
    sur ${total.toLocaleString("fr")} dans cette région · ${mapPOI.length.toLocaleString("fr")} au total</div>`;
}

/* ---------- fond de carte : image locale > tuiles du jeu > fond généré ---------- */
function setBgNote(txt){
  const el = document.getElementById("mapSource");
  if (el) el.innerHTML = txt;
}
function useTiles(){
  let failed = 0, ok = 0, retried = 0;
  tileLayer = L.tileLayer(REGIONS[mapRegion].tiles, { minZoom: 1, minNativeZoom: 1, maxZoom: 7, maxNativeZoom: 4,
    tileSize: 512, noWrap: true, bounds: TILE_BOUNDS, className: "mapbg", keepBuffer: 2 });
  tileLayer.on("tileload", () => ok++);
  tileLayer.on("tileerror", e => {
    failed++;
    const t = e.tile;
    if (!t) return;
    const n = +(t.dataset.retry || 0);
    if (n < 2){
      t.dataset.retry = n + 1; retried++;
      const base = t.src.split("#")[0];
      setTimeout(() => { t.src = base + "#r" + (n + 1); }, 400 * (n + 1));
      return;
    }
    if (failed - retried >= 6 && failed > ok) useGenerated();
  });
  tileLayer.addTo(mapObj);
  setBgNote(`carte du jeu via <a href="https://paldb.cc" target="_blank">paldb.cc</a>`);
}
function useGenerated(){
  const pts = mapPOI.filter(p => p.reg === mapRegion).map(p => {
    const [lat, lng] = REGIONS[mapRegion].toPix(p.mx, p.my); return { lat, lng }; });
  if (!pts.length) return;
  const bg = buildBackdrop(pts);
  if (tileLayer) mapObj.removeLayer(tileLayer);
  tileLayer = L.imageOverlay(bg.url, bg.bounds, { opacity: .95, className: "mapbg" }).addTo(mapObj);
  setBgNote(`fond généré (carte du jeu indisponible)`);
}
