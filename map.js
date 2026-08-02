"use strict";
/* ==================== CARTE INTERACTIVE ====================
   Points d'intérêt : dataset MIT palworld-save-pal (oMaN-Rod) via jsDelivr.
   Conversion coordonnées sauvegarde -> coordonnées in-game : palworld-coord (palworld.lol). */

const MAP_TRANSL_X = 123888, MAP_TRANSL_Y = 158000, MAP_SCALE = 459;
function savToMap(x, y){ return { x: Math.round((y - MAP_TRANSL_Y) / MAP_SCALE), y: Math.round((x + MAP_TRANSL_X) / MAP_SCALE) }; }

const MAP_CATS = {
  ft:      { label: "Voyage rapide", icon: "🚩", color: "#5eead4" },
  tower:   { label: "Tours de guet", icon: "🗼", color: "#38bdf8" },
  effigy:  { label: "Statues de Pal Ancien", icon: "🗿", color: "#f3ca63" },
  dungeon: { label: "Donjons", icon: "🕳️", color: "#a78bfa" },
  alpha:   { label: "Pals Alpha", icon: "👑", color: "#fb923c" },
  predator:{ label: "Prédateurs", icon: "💀", color: "#f87171" },
  relic:   { label: "Reliques / bonus", icon: "🔮", color: "#4ade80" }
};
const RELIC_FR = { jump_power: "Puissance de saut", status_ailment_resist: "Résistance aux altérations",
  capture_power: "Puissance de capture", stamina_reduction: "Endurance", hunger_reduction: "Faim",
  glider_speed: "Vitesse du planeur", swim_speed: "Nage", exp_bonus: "Bonus d'XP",
  climb_speed: "Escalade", food_decay_reduction: "Conservation des aliments",
  rainbow_passive_rate: "Taux de passif arc-en-ciel", sphere_homing: "Sphères à tête chercheuse" };

let mapInit = false, mapPOI = null, mapActive = {}, mapObj = null, mapLayer = null;
Object.keys(MAP_CATS).forEach(k => mapActive[k] = true);

function initMapTab(){
  if (mapInit) return;
  mapInit = true;
  const status = document.getElementById("mapStatus");
  status.innerHTML = `<div class="count-info">🗺️ Chargement de la carte et des points d'intérêt…</div>`;
  Promise.all([loadLeaflet(), loadPOI()]).then(([, poi]) => {
    mapPOI = poi;
    buildMapUI();
  }).catch(err => {
    status.innerHTML = `<div class="warnbox">Impossible de charger la carte : ${err.message}</div>`;
  });
}
function loadLeaflet(){
  if (window.L) return Promise.resolve();
  return new Promise((res, rej) => {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = res; s.onerror = () => rej(new Error("Leaflet indisponible"));
    document.head.appendChild(s);
  });
}
async function loadPOI(){
  const B = PSP_BASE;
  const [ft, eff, mo, rel] = await Promise.all([
    fetch(B + "fast_travel_points.json").then(r => r.json()),
    fetch(B + "effigies.json").then(r => r.json()),
    fetch(B + "map_objects.json").then(r => r.json()),
    fetch(B + "relics.json").then(r => r.json())
  ]);
  const pts = [];
  const arr = o => Array.isArray(o) ? o : Object.values(o);
  arr(ft).forEach(p => {
    const isTower = /UnlockMapPoint/.test(p.class || "");
    pts.push({ c: isTower ? "tower" : "ft", x: p.x, y: p.y, n: prettyFT(p.id) });
  });
  arr(eff).forEach(p => pts.push({ c: "effigy", x: p.x, y: p.y, n: "Statue de Pal Ancien" }));
  arr(mo).forEach(p => {
    const c = p.type === "dungeon" ? "dungeon" : p.type === "alpha_pal" ? "alpha" : "predator";
    pts.push({ c, x: p.x, y: p.y, n: MAP_CATS[c].label });
  });
  arr(rel).forEach(p => pts.push({ c: "relic", x: p.x, y: p.y,
    n: "Relique — " + (RELIC_FR[p.relic_type] || p.relic_type) }));
  return pts;
}
function prettyFT(id){
  if (!id) return "Point de voyage rapide";
  if (/^WatchTower/.test(id)) return "Tour de guet";
  if (/^SkyIsland/.test(id)) return "Île céleste";
  if (/^WorldTree/.test(id)) return "Arbre-Monde";
  if (/^Boss_/.test(id)) return "Zone de boss — " + id.replace("Boss_", "");
  return "Point de voyage rapide";
}
function buildMapUI(){
  const counts = {};
  mapPOI.forEach(p => counts[p.c] = (counts[p.c] || 0) + 1);
  document.getElementById("mapStatus").innerHTML =
    `<div class="count-info">🗺️ <b>${mapPOI.length.toLocaleString("fr")}</b> points d'intérêt · clique un marqueur pour ses coordonnées in-game</div>`;
  document.getElementById("mapFilters").innerHTML = `<div class="chiprow">` +
    Object.entries(MAP_CATS).map(([k, c]) =>
      `<button class="chipf on" data-cat="${k}" style="--c:${c.color}">${c.icon} ${c.label} <span class="cnt2">${counts[k] || 0}</span></button>`).join("") +
    `</div>`;
  document.querySelectorAll("#mapFilters [data-cat]").forEach(b => b.addEventListener("click", () => {
    mapActive[b.dataset.cat] = !mapActive[b.dataset.cat];
    b.classList.toggle("on", mapActive[b.dataset.cat]);
    drawMarkers();
  }));

  /* bornes du monde (coordonnées sauvegarde) */
  const xs = mapPOI.map(p => p.x), ys = mapPOI.map(p => p.y);
  const pad = 60000;
  const bounds = [[Math.min(...xs) - pad, Math.min(...ys) - pad], [Math.max(...xs) + pad, Math.max(...ys) + pad]];
  mapObj = L.map("mapCanvas", { crs: L.CRS.Simple, minZoom: -12, maxZoom: -6, zoomSnap: .25,
    attributionControl: false, preferCanvas: true });
  /* fond optionnel : place un fichier map.jpg à la racine du site pour l'afficher */
  const img = new Image();
  img.onload = () => {
    L.imageOverlay(img.src, [[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]], { opacity: .9 }).addTo(mapObj);
  };
  img.src = "map.jpg";
  mapLayer = L.layerGroup().addTo(mapObj);
  mapObj.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]);
  /* affichage des coordonnées au survol */
  const info = document.getElementById("mapCoords");
  mapObj.on("mousemove", e => {
    const m = savToMap(e.latlng.lng, e.latlng.lat);
    info.textContent = `Coordonnées in-game : ${m.x}, ${m.y}`;
  });
  drawMarkers();
}
function drawMarkers(){
  if (!mapLayer) return;
  mapLayer.clearLayers();
  let n = 0;
  for (const p of mapPOI){
    if (!mapActive[p.c]) continue;
    n++;
    const c = MAP_CATS[p.c];
    const m = savToMap(p.x, p.y);
    L.circleMarker([p.y, p.x], { radius: p.c === "ft" || p.c === "dungeon" ? 6 : 5,
      color: c.color, weight: 1.5, fillColor: c.color, fillOpacity: .55 })
      .bindPopup(`<b>${c.icon} ${p.n}</b><br><span style="opacity:.75">Coordonnées in-game : <b>${m.x}, ${m.y}</b></span>`)
      .addTo(mapLayer);
  }
  const el = document.getElementById("mapShown");
  if (el) el.textContent = n.toLocaleString("fr");
}
