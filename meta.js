"use strict";
/* ==================== META : BUILDS DE PASSIFS PAR RÔLE ====================
   Builds établis d'après le méta Palworld 1.0 (juillet 2026), effets vérifiés
   sur les données du jeu. Un pal porte au maximum 4 passifs. */

const META_BUILDS = [
  { id: "work-noct", cat: "work", titre: "Ouvrier maximal (pal nocturne)", icone: "⚒️",
    pass: ["Main du Démon", "Maîtrise Exceptionnelle", "Appliqué", "Soumis"],
    total: "+245 % de vitesse de travail",
    pour: "Pals naturellement nocturnes (Solenne, Dandilord, Celesdir Noct, Frostallion Noct…) enfermés dans une base de production.",
    notes: ["Main du Démon fait chuter la MEN 15 % plus vite : compense avec de la bonne nourriture, des lits corrects et des sources chaudes plutôt qu'en retirant le passif.",
            "Le -30 % d'attaque de Soumis n'a aucune importance sur un ouvrier qui ne se bat jamais."] },
  { id: "work-day", cat: "work", titre: "Ouvrier 24 h/24 (pal diurne)", icone: "🌙",
    pass: ["Main du Démon", "Maîtrise Exceptionnelle", "Appliqué", "Nocturne"],
    total: "+215 % de vitesse de travail, et il ne dort jamais",
    pour: "Tout ouvrier non nocturne : Nocturne remplace Soumis pour une production sans interruption la nuit.",
    notes: ["La vitesse de travail ne monte pas le niveau d'aptitude affiché : pars d'un pal qui a déjà un bon niveau dans la tâche."] },
  { id: "work-budget", cat: "work", titre: "Ouvrier accessible (début/milieu de partie)", icone: "🔧",
    pass: ["Appliqué", "Soumis", "Sérieux", "Nocturne"],
    total: "+100 % de vitesse de travail, sans passif d'Arbre-Monde",
    pour: "Avant d'avoir accès aux œufs sinistres et à la table de chirurgie.",
    notes: ["Ces quatre passifs se trouvent sur des pals sauvages : c'est la base solide à viser en premier."] },
  { id: "ranch", cat: "work", titre: "Pal de ranch", icone: "🥚",
    pass: ["Maître Éleveur", "Apprenti Éleveur", "Main du Démon", "Maîtrise Exceptionnelle"],
    total: "+3 niveaux d'Exploitation et +165 % de vitesse",
    pour: "Ranch (laine, œufs, lait, miel…) tant que ton niveau d'Exploitation n'est pas au maximum.",
    notes: ["Maître Éleveur et Apprenti Éleveur augmentent vraiment le niveau d'aptitude, contrairement aux passifs de vitesse."] },
  { id: "breed", cat: "work", titre: "Parents reproducteurs", icone: "💞",
    pass: ["Philanthrope", "Nocturne"],
    total: "+100 % de vitesse de production d'œufs",
    pour: "Les deux parents placés dans l'enclos d'élevage.",
    notes: ["Ne remplis pas les parents de passifs inutiles : chaque passif supplémentaire élargit le tirage et rend le combo voulu plus dur à obtenir. Garde 2+2 ou 3+1.",
            "Mets Baby-sitter (+30 % production et éclosion) sur un pal de soutien dédié : Braloha par exemple : plutôt que sur un parent."] },
  { id: "combat", cat: "fight", titre: "Combat polyvalent", icone: "⚔️",
    pass: ["Immortel", "Colère Divine", "Sérénité", "Légende"],
    total: "+75 % d'attaque, vol de vie, régénération et recharge accélérée",
    pour: "Exploration, alphas, boss de donjon et la majorité du contenu de fin de partie.",
    notes: ["Le meilleur rapport puissance/survie : aucun de ces passifs n'a de vrai malus."] },
  { id: "burst", cat: "fight", titre: "Dégâts maximum (fragile)", icone: "💥",
    pass: ["Lame du Jugement", "Dieu de la Destruction", "Colère Divine", "Sérénité"],
    total: "+130 % d'attaque, mais -50 % de PV et -10 % de défense",
    pour: "Tuer vite quand tu maîtrises le combat.",
    notes: ["Peu fiable en raid long ou face aux dégâts inévitables : à réserver aux affrontements contrôlés."] },
  { id: "tank", cat: "fight", titre: "Tank de raid", icone: "🛡️",
    pass: ["Immortel", "Corps Adamantin", "Légende", "Sérénité"],
    total: "+50 % de défense, immunité au recul et aux projections",
    pour: "Raids et boss longs où le pal doit enchaîner plusieurs rotations.",
    notes: ["Corps Adamantin empêche d'être interrompu, ce qui vaut souvent plus que du pur dégât."] },
  { id: "elem", cat: "fight", titre: "Spécialiste élémentaire", icone: "🔮",
    pass: ["Immortel", "Colère Divine", "Sérénité", "(passif de ton élément)"],
    total: "+30 % de dégâts sur ton élément principal",
    pour: "Un pal dont toutes les compétences actives partagent le même élément.",
    notes: ["Neutre → Empereur Céleste · Feu → Empereur Enflammé · Eau → Seigneur des Mers · Foudre → Seigneur des Tempêtes · Plante → Divinité de la Forêt · Glace → Empereur Glacial · Terre → Empereur Terrestre · Ténèbres → Seigneur des Enfers · Dragon → Dragon Divin"] },
  { id: "mount", cat: "mount", titre: "Monture la plus rapide", icone: "🏇",
    pass: ["Traverse-Mondes", "Sprinteur", "Légende", "Coursier"],
    total: "+120 % de vitesse de déplacement",
    pour: "Trajets courts, exploration de la carte, montures avec assez d'endurance naturelle.",
    notes: ["Traverse-Mondes fait grimper la faim de 15 % : garde de la nourriture sur toi."] },
  { id: "mount-long", cat: "mount", titre: "Monture longue distance", icone: "🪽",
    pass: ["Traverse-Mondes", "Sprinteur", "Légende", "Vigueur Éternelle"],
    total: "+100 % de vitesse et +75 % d'endurance en monture",
    pour: "Jetragon ou toute monture volante pour traverser la carte sans se poser.",
    notes: ["Remplace Vigueur Éternelle par Infatigable (+50 %) si tu ne l'as pas encore."] },
  { id: "mount-water", cat: "mount", titre: "Monture aquatique", icone: "🌊",
    pass: ["Traverse-Mondes", "Sprinteur", "Roi des Vagues", "Coursier Marin"],
    total: "+80 % de vitesse générale et +90 % sur l'eau",
    pour: "Traversées maritimes et exploration côtière.",
    notes: [] },
  { id: "mount-fight", cat: "mount", titre: "Monture de combat", icone: "🐎",
    pass: ["Traverse-Mondes", "Légende", "Corps Adamantin", "Anomalie"],
    total: "Vitesse + défense + régénération pour le pal et le joueur",
    pour: "Raids et zones dangereuses où tu restes en selle.",
    notes: ["Anomalie soigne aussi le joueur et immunise contre poison et brûlure."] },
  { id: "support", cat: "player", titre: "Soutien du joueur (combat)", icone: "🎖️",
    pass: ["Chef d'Assaut", "Stratège de Forteresse", "Instructeur de Tir", "Ange Médecin"],
    total: "+10 % attaque, +10 % défense, +4 % rechargement et régénération pour TOI",
    pour: "Un pal gardé en équipe uniquement pour ses bonus au joueur.",
    notes: ["Ces passifs n'agissent pas sur le pal mais sur le joueur : inutile de les mettre sur un combattant."] },
  { id: "farm", cat: "player", titre: "Soutien récolte", icone: "⛏️",
    pass: ["Chef d'Extraction", "Chef d'Abattage", "Motivateur", "Généreux"],
    total: "+25 % extraction, +25 % abattage, +25 % productivité et +50 % d'objets obtenus",
    pour: "Un pal de sac à dos pendant les sessions de farm de minerai et de bois.",
    notes: ["Grand Prince (+100 % d'objets obtenus) remplace Généreux si tu l'as."] }
];
const META_CATS = { work: "⚒️ Base & production", fight: "⚔️ Combat", mount: "🏇 Montures", player: "🎖️ Soutien joueur" };

/* rôles -> comment classer les pals recommandés (données Paldex) */
const META_PALS = {
  "work-noct":   { type: "nocturne" },
  "work-day":    { type: "work", key: "Handcraft" },
  "work-budget": { type: "work", key: "Handcraft" },
  "ranch":       { type: "work", key: "MonsterFarm" },
  "breed":       { type: "none" },
  "combat":      { type: "stat", key: "attack" },
  "burst":       { type: "stat", key: "attack" },
  "tank":        { type: "stat", key: "defense" },
  "elem":        { type: "stat", key: "attack" },
  "mount":       { type: "speed" }, "mount-long": { type: "speed" },
  "mount-water": { type: "speed" }, "mount-fight": { type: "speed" },
  "support":     { type: "none" }, "farm": { type: "none" }
};

let metaInit = false, metaCat = "all";
function initMetaTab(){
  if (metaInit) return;
  metaInit = true;
  document.getElementById("metaFilters").innerHTML = `<div class="chiprow" id="metaCats">
    <button class="chipf on" data-mcat="all">Tous les rôles</button>
    ${Object.entries(META_CATS).map(([k, v]) => `<button class="chipf" data-mcat="${k}">${v}</button>`).join("")}
  </div>`;
  document.querySelectorAll("#metaCats [data-mcat]").forEach(b => b.addEventListener("click", () => {
    metaCat = b.dataset.mcat;
    document.querySelectorAll("#metaCats [data-mcat]").forEach(x => x.classList.toggle("on", x === b));
    renderMeta();
  }));
  renderMeta();
  try { loadPspPals().then(() => renderMeta()).catch(() => {}); } catch(e){}
}
function passInfo(nom){
  const p = (typeof PASSIVES !== "undefined") ? PASSIVES.find(x => x.n === nom) : null;
  return p || null;
}
function bestPalsFor(id){
  if (!PSP_PALS) return "";
  const cfg = META_PALS[id] || { type: "none" };
  if (cfg.type === "none") return "";
  let ids = SORTED_IDS.filter(i => !PALS[i].monster && !HORS_VANILLA.has(i) && pspOf(i));
  if (cfg.type === "nocturne"){
    ids = ids.filter(i => pspOf(i).nocturnal)
      .sort((a, b) => Math.max(...Object.values(pspOf(b).work_suitability || {0:0})) - Math.max(...Object.values(pspOf(a).work_suitability || {0:0})));
  } else if (cfg.type === "work"){
    ids = ids.filter(i => (pspOf(i).work_suitability || {})[cfg.key] > 0)
      .sort((a, b) => pspOf(b).work_suitability[cfg.key] - pspOf(a).work_suitability[cfg.key]);
  } else if (cfg.type === "stat"){
    ids.sort((a, b) => ((pspOf(b).scaling || {})[cfg.key] || 0) - ((pspOf(a).scaling || {})[cfg.key] || 0));
  } else if (cfg.type === "speed"){
    ids.sort((a, b) => (pspOf(b).ride_sprint_speed || 0) - (pspOf(a).ride_sprint_speed || 0));
  }
  const top = ids.slice(0, 6);
  if (!top.length) return "";
  const val = i => {
    const p = pspOf(i);
    if (cfg.type === "work") return " " + p.work_suitability[cfg.key];
    if (cfg.type === "stat") return " " + ((p.scaling || {})[cfg.key] || "");
    if (cfg.type === "speed") return " " + (p.ride_sprint_speed || "");
    return "";
  };
  return `<div class="metapals"><span class="metalbl">Pals conseillés</span>
    ${top.map(i => `<span class="reachchip" data-dex="${i}">${icon(i, "", 26)}${PALS[i].name}<b class="mv">${val(i)}</b></span>`).join("")}</div>`;
}
function renderMeta(){
  const list = META_BUILDS.filter(b => metaCat === "all" || b.cat === metaCat);
  document.getElementById("metaList").innerHTML = list.map((b, i) => {
    const passes = b.pass.map(n => {
      const p = passInfo(n);
      if (!p) return `<div class="mpass ghost"><b>${n}</b></div>`;
      return `<div class="mpass rk${p.r > 0 ? p.r : "n"}" data-pass="${n}">
        <b>${n}</b><span class="mrank">${p.r > 0 ? "★".repeat(p.r) : "▼"}</span>
        <ul>${p.e.map(e => `<li>${e}</li>`).join("")}</ul></div>`;
    }).join("");
    return `<div class="metacard" ${reduceMotion ? "" : `style="animation-delay:${i * 40}ms"`}>
      <div class="metahead"><span class="mi">${b.icone}</span>
        <div><div class="mtitre">${b.titre}</div><div class="mtotal">${b.total}</div></div>
        <span class="mcat">${META_CATS[b.cat]}</span></div>
      <div class="mpour">${b.pour}</div>
      <div class="mpasses">${passes}</div>
      ${b.notes.length ? `<ul class="mnotes">${b.notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
      ${bestPalsFor(b.id)}
    </div>`;
  }).join("");
  document.querySelectorAll("#metaList [data-dex]").forEach(el => el.addEventListener("click", () => {
    switchTab("dex");
    setTimeout(() => { if (typeof showPalSheet === "function") showPalSheet(el.dataset.dex); }, 300);
  }));
  document.querySelectorAll("#metaList [data-pass]").forEach(el => el.addEventListener("click", () => {
    switchTab("passives");
    setTimeout(() => {
      const inp = document.getElementById("passSearch");
      if (inp){ inp.value = el.dataset.pass; inp.dispatchEvent(new Event("input")); }
    }, 300);
  }));
}
