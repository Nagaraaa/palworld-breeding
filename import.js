"use strict";
/* ==================== IMPORT DE SAUVEGARDE (Level.sav) ==================== */
const CODES_RAW = "1.0|SheepBall;2.0|PinkCat;3.0|ChickenPal;4.0|Carbunclo;5.0|BluePlatypus;5.1|BluePlatypus_Fire;6.0|CuteFox;7.0|FlyingManta;7.1|FlyingManta_Thunder;8.0|WoolFox;9.0|KendoFrog;9.1|KendoFrog_Dark;10.0|LeafMomonga;11.0|Ganesha;12.0|PlantSlime;12.1|PlantSlime_Flower;13.0|SamuraiDog;14.0|CloverFairy;15.0|Hedgehog;15.1|Hedgehog_Ice;16.0|NegativeKoala;17.0|Penguin;17.1|Penguin_Electric;18.0|CaptainPenguin;18.1|CaptainPenguin_Black;19.0|WizardOwl;20.0|Alpaca;21.0|KingAlpaca;21.1|KingAlpaca_Ice;22.0|DreamDemon;23.0|Monkey;23.1|Monkey_Fire;24.0|NightFox;25.0|LavaGirl;26.0|FlameBambi;27.0|Bastet;27.1|Bastet_Ice;28.0|Boar;29.0|Kitsunebi;29.1|Kitsunebi_Ice;30.0|NegativeOctopus;30.1|NegativeOctopus_Neutral;31.0|CuteMole;32.0|Deer;32.1|Deer_Ground;33.0|Garm;34.0|BerryGoat;34.1|BerryGoat_Dark;35.0|MopBaby;36.0|MopKing;37.0|TentacleTurtle;37.1|TentacleTurtle_Ground;38.0|WindChimes;38.1|WindChimes_Ice;39.0|SweetsSheep;39.1|SweetsSheep_Ground;40.0|CowPal;41.0|BlueDragon;41.1|BlueDragon_Ice;42.0|ElecCat;43.0|Kelpie;43.1|Kelpie_Fire;44.0|PinkRabbit;44.1|PinkRabbit_Grass;45.0|JellyfishFairy;46.0|JellyfishGhost;47.0|ClioneTwins;48.0|OctopusGirl;48.1|OctopusGirl_Neutral;49.0|Eagle;50.0|GhostBlackCat;51.0|HawkBird;52.0|CatBat;53.0|ColorfulBird;54.0|Kirin;54.1|Kirin_Ice;55.0|SharkKid;55.1|SharkKid_Fire;56.0|Werewolf;56.1|Werewolf_Ice;57.0|DarkCrow;58.0|FlameBuffalo;59.0|FluffyBird;60.0|LittleBriarRose;61.0|CuteButterfly;62.0|ElecPomeranian;63.0|FairyDragon;63.1|FairyDragon_Water;64.0|BirdDragon;64.1|BirdDragon_Ice;65.0|CatVampire;66.0|VioletFairy;67.0|SoldierBee;68.0|QueenBee;69.0|PinkLizard;70.0|NaughtyCat;71.0|PurpleSpider;72.0|IceSeal;72.1|IceSeal_Ground;73.0|LizardMan;73.1|LizardMan_Fire;74.0|Gorilla;74.1|Gorilla_Ground;75.0|Serpent;75.1|Serpent_Ground;76.0|RobinHood;76.1|RobinHood_Ground;77.0|FlowerRabbit;78.0|FoxMage;78.1|FoxMage_Dark;79.0|CatMage;79.1|CatMage_Fire;80.0|HadesBird;80.1|HadesBird_Electric;81.0|GrassMinotaur;81.1|GrassMinotaur_Ice;82.0|Mutant;83.0|FengyunDeeper;83.1|FengyunDeeper_Electric;84.0|FlowerDinosaur;84.1|FlowerDinosaur_Electric;85.0|Ronin;85.1|Ronin_Dark;86.0|IceCrocodile;87.0|GrassMammoth;87.1|GrassMammoth_Ice;88.0|StuffedShark;88.1|StuffedShark_Fire;89.0|FlowerDoll;89.1|FlowerDoll_Fire;90.0|PandaGirl;91.0|Baphomet;91.1|Baphomet_Dark;92.0|RaijinDaughter;92.1|RaijinDaughter_Water;93.0|FireKirin;93.1|FireKirin_Dark;94.0|LazyDragon;94.1|LazyDragon_Electric;95.0|IceFox;96.0|ThunderBird;96.1|ThunderBird_Ice;97.0|GhostAnglerfish;97.1|GhostAnglerfish_Fire;98.0|ThunderDog;98.1|ThunderDog_Ice;99.0|DarkScorpion;99.1|DarkScorpion_Ground;100.0|CactusDoll;100.1|CactusDoll_Dark;101.0|IceDeer;102.0|GrassPanda;102.1|GrassPanda_Electric;103.0|WeaselDragon;103.1|WeaselDragon_Fire;104.0|RedArmorBird;105.0|VolcanoDragon;105.1|VolcanoDragon_Ice;106.0|TropicalOstrich;107.0|DrillGame;108.0|SakuraSaurus;108.1|SakuraSaurus_Water;109.0|LazyCatfish;109.1|LazyCatfish_Gold;110.0|Plesiosaur;111.0|AmaterasuWolf;111.1|AmaterasuWolf_Dark;112.0|Manticore;112.1|Manticore_Dark;113.0|HerculesBeetle;113.1|HerculesBeetle_Ground;114.0|SnowPeafowl;115.0|DarkFlameFox;116.0|WhiteMoth;116.1|WhiteMoth_Neutral;117.0|GhostBeast;118.0|MushroomDragon;118.1|MushroomDragon_Dark;119.0|IceWitch;120.0|MummyPal;121.0|Umihebi;121.1|Umihebi_Fire;122.0|Suzaku;122.1|Suzaku_Water;123.0|FeatherOstrich;124.0|SkyDragon;124.1|SkyDragon_Grass;125.0|LeafPrincess;126.0|SmallArmadillo;127.0|GuardianDog;128.0|SwordCutlassfish;128.1|SwordCutlassfish_Fire;129.0|VolcanicMonster;129.1|VolcanicMonster_Ice;130.0|NightBlueHorse;130.1|NightBlueHorse_Neutral;131.0|RockBeast;131.1|RockBeast_Ice;132.0|WhiteTiger;132.1|WhiteTiger_Ground;133.0|SmallYeti;134.0|Yeti;134.1|Yeti_Grass;135.0|CandleGhost;136.0|VenusFlytrap;137.0|KingBahamut;137.1|KingBahamut_Dragon;138.0|GrassGolem;138.1|GrassGolem_Dark;139.0|Anubis;140.0|Sekhmet;141.0|ScorpionMan;141.1|ScorpionMan_Electric;142.0|CubeTurtle;142.1|CubeTurtle_Neutral;143.0|BadCatgirl;144.0|MimicDog;145.0|DarkAlien;146.0|WhiteAlienDragon;147.0|BlueberryFairy;148.0|GhostRabbit;148.1|GhostRabbit_Grass;149.0|BlackPuppy;149.1|BlackPuppy_Ice;150.0|MysteryMask;151.0|IceNarwhal;151.1|IceNarwhal_Fire;152.0|GrassRabbitMan;153.0|GrimGirl;154.0|GoldenHorse;155.0|SifuDog;156.0|SumoDog;157.0|WhiteDeer;157.1|WhiteDeer_Dark;158.0|BlackMetalDragon;159.0|WingGolem;159.1|WingGolem_Fire;160.0|WhiteShieldDragon;161.0|BlueThunderHorse;162.0|LongCat;163.0|ElecSnail;163.1|ElecSnail_Ground;164.0|DandelionGirl;165.0|BrownRabbit;166.0|HoodGhost;167.0|ElecLizard;168.0|OniGhostGirl;169.0|KingSunfish;169.1|KingSunfish_Thunder;170.0|SleeveRabbit;171.0|GhostDragon;171.1|GhostDragon_Fire;172.0|ThunderFluffyBird;173.0|RedFlowerBird;174.0|FoxExorcist;175.0|LotusDragon;176.0|ClownRabbit;177.0|ThiefBird;178.0|SnakeGirl;179.0|MushroomLady;180.0|LanternButler;181.0|MoonChild;182.0|MonochromeQueen;183.0|KabukiMan;184.0|DomeArmorDragon;185.0|ElecPanda;186.0|LilyQueen;186.1|LilyQueen_Dark;187.0|ThunderDragonMan;188.0|Horus;188.1|Horus_Water;189.0|BlackGriffon;190.0|MoonQueen;191.0|SnowTigerBeastman;192.0|BlueSkyDragon;193.0|Mothman;194.0|FlowerPrince;195.0|NightLady;195.1|NightLady_Dark;196.0|DarkMechaDragon;197.0|LegendDeer;198.0|SaintCentaur;199.0|BlackCentaur;200.0|IceHorse;200.1|IceHorse_Dark;201.0|PoseidonOrca;202.0|JetDragon;203.0|KingWhale;204.0|WorldTreeDragon;M1|YakushimaMonster001;M2|YakushimaMonster001_Blue;M3|YakushimaMonster001_Red;M4|YakushimaMonster001_Purple;M5|YakushimaMonster001_Pink;M6|YakushimaMonster001_Rainbow;M7|YakushimaMonster003_Purple;M8|YakushimaMonster003;M9|YakushimaBoss001_Small;M10|YakushimaMonster002;M11|YakushimaBoss001";
const CODE2ID = {};
CODES_RAW.split(";").forEach(row => { const [id, code] = row.split("|"); CODE2ID[code.toLowerCase()] = id; });

/* collection détaillée persistée : id -> {n, s (étoiles max), l (niveau max), lucky} */
let collection = {};
try { collection = JSON.parse(localStorage.getItem("pw_col") || "{}"); } catch(e){}
function saveCollection(){ localStorage.setItem("pw_col", JSON.stringify(collection)); }

function decorateMineCells(){
  const grid = document.getElementById("mineGrid");
  if (!grid) return;
  grid.querySelectorAll(".palcell").forEach(cell => {
    const id = cell.dataset.id, c = collection[id];
    cell.querySelectorAll(".cellcnt,.cellstar").forEach(x => x.remove());
    if (!c) return;
    const cnt = document.createElement("span");
    cnt.className = "cellcnt"; cnt.textContent = "×" + c.n;
    cell.appendChild(cnt);
    if (c.s > 0){
      const st = document.createElement("span");
      st.className = "cellstar"; st.textContent = "★" + c.s;
      cell.appendChild(st);
    }
    cell.title = PALS[id].name + " " + palNo(id) + " — ×" + c.n +
      (c.s ? " · " + c.s + "★ max" : "") + (c.l ? " · Nv." + c.l + " max" : "") +
      (c.lucky ? " · " + c.lucky + " lucky/alpha" : "");
  });
}

/* ---- lecture binaire ---- */
function indexOfBytes(hay, pat, from, to){
  const end = (to === undefined ? hay.length : to) - pat.length + 1;
  outer: for (let i = from; i < end; i++){
    if (hay[i] !== pat[0]) continue;
    for (let j = 1; j < pat.length; j++) if (hay[i + j] !== pat[j]) continue outer;
    return i;
  }
  return -1;
}
function propPattern(name){
  /* int32 len + name + \0 (noms toujours ASCII) */
  const p = new Uint8Array(4 + name.length + 1);
  const len = name.length + 1;
  p[0] = len & 255; p[1] = (len >> 8) & 255; p[2] = (len >> 16) & 255; p[3] = (len >> 24) & 255;
  for (let i = 0; i < name.length; i++) p[4 + i] = name.charCodeAt(i);
  p[4 + name.length] = 0;
  return p;
}
function readFString(data, dv, pos){
  const len = dv.getInt32(pos, true); pos += 4;
  if (len === 0) return { str: "", next: pos };
  if (len > 0){
    let s = "";
    for (let i = 0; i < len - 1; i++) s += String.fromCharCode(data[pos + i]);
    return { str: s, next: pos + len };
  }
  const n = -len;
  let s = "";
  for (let i = 0; i < n - 1; i++) s += String.fromCharCode(dv.getUint16(pos + i * 2, true));
  return { str: s, next: pos + n * 2 };
}
/* lit la valeur d'une propriété dont le NOM commence à pos (après le pattern nom) */
function readPropValue(data, dv, pos){
  const t = readFString(data, dv, pos);                 /* type ex: StrProperty */
  let p = t.next + 8;                                   /* taille int64 */
  const type = t.str;
  if (type === "StrProperty" || type === "NameProperty"){
    p += 1;                                             /* guid flag */
    return readFString(data, dv, p).str;
  }
  if (type === "IntProperty"){ p += 1; return dv.getInt32(p, true); }
  if (type === "ByteProperty"){
    const en = readFString(data, dv, p);      /* nom d'enum ("None" => octet brut) */
    return data[en.next + 1];                 /* saute le flag guid puis lit la valeur */
  }
  if (type === "Int64Property"){ p += 1; return Number(dv.getBigInt64(p, true)); }
  if (type === "UInt16Property"){ p += 1; return dv.getUint16(p, true); }
  if (type === "BoolProperty"){ return data[t.next + 8] !== 0; } /* valeur avant flag */
  if (type === "EnumProperty"){
    const et = readFString(data, dv, p);                /* type d'enum */
    p = et.next + 1;
    return readFString(data, dv, p).str;
  }
  return null;
}
async function oodleDecompress(u8, rawSize){
  if (!window.__oozFactory) throw new Error("Décodeur Oodle indisponible.");
  const M = await (window.__oozInst || (window.__oozInst = window.__oozFactory()));
  const cp = M._malloc(u8.byteLength); M.HEAPU8.set(u8, cp);
  const dp = M._malloc(rawSize + 64);
  const res = M._Kraken_Decompress(cp, u8.byteLength, dp, rawSize);
  M._free(cp);
  if (res !== rawSize){ M._free(dp); throw new Error("Échec de décompression Oodle (" + res + "/" + rawSize + ")."); }
  const out = new Uint8Array(M.HEAPU8.buffer, dp, rawSize).slice();
  M._free(dp);
  return out;
}
/* lit la valeur GUID d'une StructProperty(Guid) dont le nom se termine à pos */
function readGuidValue(data, dv, pos){
  const t = readFString(data, dv, pos);          /* "StructProperty" */
  if (t.str !== "StructProperty") return null;
  let p = t.next + 8;                            /* taille */
  const st = readFString(data, dv, p);           /* "Guid" */
  if (st.str !== "Guid") return null;
  p = st.next + 17;                              /* guid du type (16) + flag (1) */
  let hex = "";
  for (let i = 0; i < 16; i++) hex += data[p + i].toString(16).padStart(2, "0");
  return hex;
}
function inflateU8(u8){
  const ds = new DecompressionStream("deflate");
  return new Response(new Blob([u8]).stream().pipeThrough(ds)).arrayBuffer()
    .then(b => new Uint8Array(b));
}
async function parseSavBuffer(buf){
  let u8 = new Uint8Array(buf);
  const dv0 = new DataView(buf);
  const magic3 = String.fromCharCode(u8[8] || 0, u8[9] || 0, u8[10] || 0);
  if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== "GVAS"){
    const rawLen = dv0.getInt32(0, true);
    if (magic3 === "PlM"){
      /* conteneur Palworld 1.0 / UE5 : Oodle (Kraken & co) */
      u8 = await oodleDecompress(u8.subarray(12), rawLen);
    } else if (magic3 === "PlZ"){
      const type = u8[11];
      const inner = u8.subarray(12);
      if (type === 0x31){ u8 = await inflateU8(inner); }
      else if (type === 0x32){ u8 = await inflateU8(await inflateU8(inner)); }
      else if (type === 0x30){ u8 = inner; }
      else throw new Error("Compression PlZ inconnue (type 0x" + type.toString(16) + ").");
    } else throw new Error("Format non reconnu (ni GVAS, ni PlZ, ni PlM) — est-ce bien une sauvegarde Palworld ?");
  }
  const data = u8, dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const PAT_CHAR = propPattern("CharacterID");
  const PAT = {
    gender: propPattern("Gender"), rank: propPattern("Rank"), level: propPattern("Level"),
    rare: propPattern("IsRarePal"), player: propPattern("IsPlayer"),
    owner: propPattern("OwnerPlayerUId"), oldOwner: propPattern("OldOwnerPlayerUIds"),
    nick: propPattern("NickName"), puid: propPattern("PlayerUId"), slot: propPattern("SlotID")
  };
  /* trouve tous les CharacterID (avec pauses pour garder l'UI fluide) */
  const marks = [];
  const CHUNK = 8 * 1024 * 1024;
  for (let start = 0; start < data.length; start += CHUNK){
    let i = start === 0 ? 0 : start - PAT_CHAR.length;
    const stop = Math.min(start + CHUNK, data.length);
    while (true){
      i = indexOfBytes(data, PAT_CHAR, i, stop + PAT_CHAR.length);
      if (i === -1 || i >= stop) break;
      marks.push(i); i += PAT_CHAR.length;
    }
    if (importUI) importUI(Math.round(stop / data.length * 100));
    await new Promise(r => setTimeout(r, 0));
  }
  const ZERO_GUID = "0".repeat(32);
  const pals = [], unknown = {}, playerNames = {};
  let players = 0, wild = 0;
  for (let m = 0; m < marks.length; m++){
    const idx = marks[m];
    const wStart = idx;
    const wEnd = Math.min(m + 1 < marks.length ? marks[m + 1] : data.length, idx + 8192);
    const rawId = readPropValue(data, dv, idx + PAT_CHAR.length);
    if (typeof rawId !== "string") continue;
    const has = pat => indexOfBytes(data, pat, wStart, wEnd) !== -1;
    const val = pat => { const i = indexOfBytes(data, pat, wStart, wEnd); return i === -1 ? null : readPropValue(data, dv, i + pat.length); };
    const guidOf = pat => { const i = indexOfBytes(data, pat, wStart, wEnd); return i === -1 ? null : readGuidValue(data, dv, i + pat.length); };
    if (has(PAT.player) && val(PAT.player) === true) continue;
    if (!rawId) continue;
    const hasOwner = has(PAT.owner) || has(PAT.oldOwner);
    const hasSlot = has(PAT.slot);
    if (!hasOwner && !hasSlot) wild++;   /* gardé quand même, groupé à part */
    const clean = rawId.replace(/^(BOSS_|PREDATOR_|RAID_|SUMMON_|GYM_)/i, "");
    const id = CODE2ID[clean.toLowerCase()];
    if (!id){ unknown[rawId] = (unknown[rawId] || 0) + 1; continue; }
    const rank = val(PAT.rank), level = val(PAT.level), g = val(PAT.gender);
    pals.push({
      id,
      stars: typeof rank === "number" ? Math.max(0, Math.min(5, rank - 1)) : 0,
      level: typeof level === "number" ? level : 1,
      gender: typeof g === "string" && g.includes("Female") ? "F" : "M",
      lucky: has(PAT.rare) && val(PAT.rare) === true,
      owner: guidOf(PAT.owner) || (hasOwner ? "aucun" : (hasSlot ? "base" : "wild"))
    });
  }
  /* pseudos des joueurs : blocs IsPlayer (avec ou sans CharacterID) */
  let ip = -1;
  while ((ip = indexOfBytes(data, PAT.player, ip + 1)) !== -1){
    if (readPropValue(data, dv, ip + PAT.player.length) !== true){ continue; }
    players++;
    const a = Math.max(0, ip - 6000), b = Math.min(data.length, ip + 6000);
    /* NickName le plus proche du bloc IsPlayer (évite la collision entre joueurs voisins) */
    let inick = -1, bestD = Infinity, s = a - 1;
    while ((s = indexOfBytes(data, PAT.nick, s + 1, b)) !== -1){
      const d = Math.abs(s - ip);
      if (d < bestD){ bestD = d; inick = s; }
    }
    const nick = inick === -1 ? null : readPropValue(data, dv, inick + PAT.nick.length);
    let k = -1, last = -1, from = a;
    while ((k = indexOfBytes(data, PAT.puid, from, ip)) !== -1){ last = k; from = k + 1; }
    const uid = last === -1 ? null : readGuidValue(data, dv, last + PAT.puid.length);
    if (uid && uid !== ZERO_GUID && typeof nick === "string" && nick) playerNames[uid] = nick;
  }
  return { pals, unknown, players, wild, playerNames };
}

function exportGuildJson(res){
  const data = JSON.stringify({ v: 1, date: new Date().toISOString(), playerNames: res.playerNames || {}, pals: res.pals });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
  a.download = "guilde-palworld.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
/* ---- UI import ---- */
let importUI = null;
function wireImport(){
  const dz = document.getElementById("dropzone"), inp = document.getElementById("savfile");
  if (!dz || dz.dataset.wired) return;
  dz.dataset.wired = "1";
  const baseHTML = dz.innerHTML;
  dz.addEventListener("click", () => inp.click());
  ["dragover", "dragenter"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("over"); }));
  dz.addEventListener("drop", e => { if (e.dataTransfer.files[0]) doImport(e.dataTransfer.files[0]); });
  inp.addEventListener("change", () => { if (inp.files[0]) doImport(inp.files[0]); });
  window.__doImport = (...a) => doImport(...a);
  async function doImport(file){
    const out = document.getElementById("importResult");
    importUI = pct => { dz.innerHTML = "⏳ Analyse de <b>" + file.name + "</b>… " + pct + " %"; };
    importUI(0);
    out.innerHTML = "";
    try {
      const buf = await file.arrayBuffer();
      let res;
      if (/\.json$/i.test(file.name) || new Uint8Array(buf, 0, 1)[0] === 0x7b){
        try { res = JSON.parse(new TextDecoder().decode(buf)); } catch(e){ throw new Error("Fichier JSON illisible."); }
        if (!res || !Array.isArray(res.pals)) throw new Error("Ce JSON n'est pas un export « guilde » de cet outil.");
        res.unknown = res.unknown || {}; res.playerNames = res.playerNames || {}; res.players = res.players || 0;
      } else {
        res = await parseSavBuffer(buf);
      }
      importUI = null;
      dz.innerHTML = baseHTML;
      const inp2 = document.getElementById("savfile");
      if (inp2) inp2.addEventListener("change", () => { if (inp2.files[0]) doImport(inp2.files[0]); });
      if (!res.pals.length){
        out.innerHTML = `<div class="warnbox">Aucun pal possédé trouvé dans ce fichier. Vérifie que c'est bien le <b>Level.sav</b> du monde (pas un backup ni LocalData.sav).${Object.keys(res.unknown).length ? " Espèces non reconnues : " + Object.keys(res.unknown).slice(0, 10).join(", ") : ""}</div>`;
        return;
      }
      /* regroupe par joueur */
      const owners = {};
      res.pals.forEach(p => (owners[p.owner] || (owners[p.owner] = [])).push(p));
      const okeys = Object.keys(owners);
      const olabel = uid => res.playerNames[uid] ||
        (uid === "base" ? "Bases / boîte de guilde" :
         uid === "wild" ? "Sans propriétaire ni conteneur (sauvages ?)" :
         uid === "aucun" ? "Sans propriétaire" : "Joueur " + uid.slice(0, 8) + "…");
      const applyImport = (palsSel, who) => {
        collection = {};
        for (const p of palsSel){
          const c = collection[p.id] || (collection[p.id] = { n: 0, s: 0, l: 0, lucky: 0 });
          c.n++; c.s = Math.max(c.s, p.stars); c.l = Math.max(c.l, p.level); if (p.lucky) c.lucky++;
          owned.add(p.id);
        }
        saveCollection(); saveOwned();
        document.querySelectorAll("#mineGrid .palcell").forEach(cell =>
          cell.classList.toggle("owned", owned.has(cell.dataset.id)));
        decorateMineCells();
        scheduleMineResults();
        const species = Object.keys(collection);
        const totalStars = palsSel.filter(p => p.stars > 0).length;
        const totalLucky = palsSel.filter(p => p.lucky).length;
        const rows = species.map(id => ({ id, ...collection[id] })).sort((a, b) => b.n - a.n || b.l - a.l);
        let html = "";
        if (/localdata/i.test(file.name)) html += `<div class="infobox">ℹ️ <b>LocalData.sav</b> ne contient que ton équipe actuelle (cache local). Pour toute ta boîte, importe le <b>Level.sav</b> du serveur.</div>`;
        html += `<div class="infobox">${ico("check",16)} <b>${palsSel.length}</b> pals importés${who ? ` pour <b>${who}</b>` : ""} · <b>${species.length}</b> espèces différentes
          ${totalStars ? " · " + totalStars + " avec étoiles" : ""}${totalLucky ? " · " + totalLucky + " lucky ou alpha" : ""}
          — cochés automatiquement ci-dessous.</div>
          <div class="toolrow"><button class="togglebtn expguild">${ico("save",15)} Exporter pour la guilde (fichier à partager sur Discord)</button></div>`;
        html += `<table class="imptable"><tr><th>Pal</th><th>Nombre</th><th>★ max</th><th>Nv. max</th><th>Lucky</th></tr>`;
        html += rows.map(r => `<tr><td>${icon(r.id)}${PALS[r.id].name}</td><td>×${r.n}</td>
          <td>${r.s ? "<span class='star'>" + "★".repeat(r.s) + "</span>" : "—"}</td>
          <td>${r.l}</td><td>${r.lucky ? "×" + r.lucky : "—"}</td></tr>`).join("");
        html += `</table>`;
        const unk = Object.keys(res.unknown);
        if (unk.length) html += `<div class="warnbox" style="margin-top:10px">Espèces non reconnues (ignorées) : ${unk.slice(0, 15).join(", ")}</div>`;
        out.innerHTML = html;
        out.querySelectorAll(".expguild").forEach(b => b.addEventListener("click", () => exportGuildJson(res)));
      };
      if (okeys.length > 1){
        /* plusieurs joueurs/guildes : sélection multiple */
        const sel = new Set();
        let html = `<div class="count-info">${ico("search",15)} ${res.pals.length.toLocaleString("fr")} pals lus dans la sauvegarde${Object.keys(res.unknown).length ? " · " + Object.keys(res.unknown).length + " espèces non reconnues" : ""} — rien n'est filtré, tout est ci-dessous.</div>
          <div class="infobox">${ico("users",16)} <b>${okeys.length}</b> groupes détectés sur le serveur.
          Coche les membres de <b>ta guilde</b> (ou juste toi), puis importe la sélection :</div>
          <div class="toolrow" id="ownerPick">`;
        okeys.sort((a, b) => owners[b].length - owners[a].length).forEach(uid => {
          const sp = new Set(owners[uid].map(p => p.id)).size;
          html += `<button class="togglebtn" data-owner="${uid}">${olabel(uid)} — ${owners[uid].length} pals (${sp} espèces)</button>`;
        });
        html += `</div><div class="toolrow">
          <button class="togglebtn" id="impSel" disabled>Importer la sélection</button>
          <button class="togglebtn" id="impAll">Tout le serveur — ${res.pals.length} pals</button>
          <button class="togglebtn expguild">${ico("save",15)} Exporter pour la guilde</button></div>`;
        out.innerHTML = html;
        const impSel = document.getElementById("impSel");
        const refresh = () => {
          const n = [...sel].reduce((s, u) => s + owners[u].length, 0);
          impSel.disabled = !sel.size;
          impSel.textContent = sel.size ? `Importer la sélection — ${sel.size} joueur${sel.size > 1 ? "s" : ""}, ${n} pals` : "Importer la sélection";
        };
        out.querySelectorAll("#ownerPick [data-owner]").forEach(btn => btn.addEventListener("click", () => {
          const uid = btn.dataset.owner;
          if (sel.has(uid)) sel.delete(uid); else sel.add(uid);
          btn.classList.toggle("on", sel.has(uid));
          refresh();
        }));
        impSel.addEventListener("click", () => {
          if (!sel.size) return;
          const pals = [...sel].flatMap(u => owners[u]);
          const names = [...sel].map(olabel);
          applyImport(pals, names.length > 3 ? names.slice(0, 3).join(", ") + " +" + (names.length - 3) : names.join(", "));
        });
        document.getElementById("impAll").addEventListener("click", () => applyImport(res.pals, "tout le serveur"));
        out.querySelectorAll(".expguild").forEach(b => b.addEventListener("click", () => exportGuildJson(res)));
      } else {
        applyImport(res.pals, okeys.length === 1 ? olabel(okeys[0]) : null);
      }
    } catch (err){
      importUI = null;
      dz.innerHTML = baseHTML;
      const inp3 = document.getElementById("savfile");
      if (inp3) inp3.addEventListener("change", () => { if (inp3.files[0]) doImport(inp3.files[0]); });
      out.innerHTML = `<div class="warnbox">Erreur : ${err.message}</div>`;
    }
  }
}

/* ==================== IMPORT NITRADO (API officielle, 100 % navigateur) ==================== */
const NIT_API = "https://api.nitrado.net";
function nitSay(html){ const el = document.getElementById("nitStatus"); if (el) el.innerHTML = html; }
async function nitApi(p, token){
  const r = await fetch(NIT_API + p, { headers: { Authorization: "Bearer " + token } });
  let j = null; try { j = await r.json(); } catch(e){}
  if (!r.ok || !j || j.status !== "success")
    throw new Error("API Nitrado " + r.status + (j && j.message ? " — " + j.message : ""));
  return j.data || {};
}
async function nitFindPalServices(token){
  const svcs = (await nitApi("/services", token)).services || [];
  const found = [];
  for (const s of svcs){
    try {
      const g = (await nitApi("/services/" + s.id + "/gameservers", token)).gameserver || {};
      const blob = JSON.stringify([g.game, g.game_human, s.details && s.details.name, s.comment]).toLowerCase();
      if (blob.includes("pal")) found.push({ id: s.id, name: (s.details && s.details.name) || g.game_human || g.game || ("service " + s.id), user: g.username });
    } catch(e){ /* service non-gameserver */ }
  }
  return { found, total: svcs.length };
}
async function nitFindSave(sid, user, token){
  const cached = localStorage.getItem("pw_nit_path");
  if (cached) return cached;
  const queue = [];
  if (user){ queue.push(["/games/" + user + "/noftp", 0], ["/games/" + user + "/ftproot", 0]); }
  queue.push(["/games", 0]);
  const seen = new Set(); let budget = 40;
  const DIR_OK = /pal|saved|savegames|savedgames|server|config|^0$|^[0-9a-f]{16,40}$/i;
  while (queue.length && budget > 0){
    const [dir, depth] = queue.shift();
    if (seen.has(dir) || depth > 6) continue;
    seen.add(dir); budget--;
    let entries;
    try { entries = (await nitApi("/services/" + sid + "/gameservers/file_server/list?dir=" + encodeURIComponent(dir), token)).entries || []; }
    catch(e){ continue; }
    for (const e of entries){
      if ((e.type === "file" || !e.type) && /^level\.sav$/i.test(e.name || "")) return e.path || (dir + "/" + e.name);
    }
    for (const e of entries){
      if (e.type === "dir" && DIR_OK.test(e.name || "")) queue.push([e.path || (dir + "/" + e.name), depth + 1]);
    }
  }
  throw new Error("Level.sav introuvable via l'API fichiers (budget de recherche épuisé). Colle le chemin exact en le demandant dans le chat.");
}
async function nitDownload(sid, savPath, token){
  const d = await nitApi("/services/" + sid + "/gameservers/file_server/download?file=" + encodeURIComponent(savPath), token);
  const url = (d.token && d.token.url) || d.url;
  if (!url) throw new Error("L'API n'a pas renvoyé d'URL de téléchargement.");
  let r;
  try { r = await fetch(url); }
  catch(e){
    nitSay(`<div class="warnbox">Le serveur de fichiers Nitrado bloque la lecture directe (CORS).
      <a href="${url}" target="_blank" style="color:var(--accent2)">Clique ici pour télécharger Level.sav</a>,
      puis dépose-le dans la zone d'import ci-dessus — le reste est identique.</div>`);
    return null;
  }
  if (!r.ok) throw new Error("Téléchargement : HTTP " + r.status);
  const total = +r.headers.get("content-length") || 0;
  const reader = r.body.getReader(); const chunks = []; let got = 0;
  while (true){
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); got += value.length;
    nitSay(`<div class="count-info">${ico("download",15)} Téléchargement du Level.sav… ${total ? Math.round(got / total * 100) + " %" : Math.round(got / 1048576) + " Mo"}</div>`);
  }
  return new File([new Blob(chunks)], "Level.sav");
}
/* lien de configuration partagé : #setup=<token> */
(function consumeSetupLink(){
  const m = /[#&]setup=([^&]+)/.exec(location.hash);
  if (!m) return;
  try { localStorage.setItem("pw_nit_token", decodeURIComponent(m[1])); } catch(e){}
  history.replaceState(null, "", location.pathname + "#mine");
})();
function wireNitrado(){
  const tok = document.getElementById("nitToken"), go = document.getElementById("nitGo"), fg = document.getElementById("nitForget");
  if (!tok || tok.dataset.wired) return;
  tok.dataset.wired = "1";
  tok.value = localStorage.getItem("pw_nit_token") || "";
  const share = document.getElementById("nitShare");
  if (share) share.addEventListener("click", () => {
    const t = tok.value.trim();
    if (!t){ nitSay(`<div class="warnbox">Renseigne d'abord ton token.</div>`); return; }
    const url = location.origin + location.pathname + "#setup=" + encodeURIComponent(t);
    navigator.clipboard.writeText(url).then(
      () => nitSay(`<div class="infobox">${ico("check",16)} Lien copié ! Envoie-le à ta guilde : en l'ouvrant, le token se configure tout seul et il leur suffit de cliquer « Récupérer ma boîte ».</div>`),
      () => nitSay(`<div class="infobox">Copie ce lien manuellement :<br><code style="word-break:break-all">${url}</code></div>`));
  });
  fg.addEventListener("click", () => {
    ["pw_nit_token", "pw_nit_service", "pw_nit_path"].forEach(k => localStorage.removeItem(k));
    tok.value = ""; nitSay(`<div class="count-info">Token et chemin oubliés.</div>`);
  });
  go.addEventListener("click", () => nitRun());
  async function nitRun(forcedSid){
    if (location.protocol === "file:"){
      nitSay(`<div class="warnbox">${ico("alert",16)} L'import Nitrado ne fonctionne pas quand la page est ouverte en double-clic
        (le navigateur envoie une origine « null » que l'API Nitrado refuse).<br>
        Mets le site en ligne (Vercel, Netlify, GitHub Pages…) et ça marchera — ou en attendant,
        télécharge le Level.sav via le FTP Nitrado et dépose-le dans la zone d'import ci-dessus.</div>`);
      return;
    }
    const token = tok.value.trim();
    if (!token){ nitSay(`<div class="warnbox">Colle d'abord ton token API Nitrado.</div>`); return; }
    localStorage.setItem("pw_nit_token", token);
    try {
      nitSay(`<div class="count-info">${ico("globe",15)} Connexion à l'API Nitrado…</div>`);
      let sid = forcedSid || localStorage.getItem("pw_nit_service");
      let user = null;
      if (!sid){
        const { found, total } = await nitFindPalServices(token);
        if (!found.length) throw new Error("Aucun serveur Palworld trouvé parmi tes " + total + " service(s). Vérifie les droits du token.");
        if (found.length > 1){
          nitSay(`<div class="count-info">Plusieurs serveurs trouvés :</div><div class="toolrow">` +
            found.map(f => `<button class="togglebtn" data-sid="${f.id}" data-user="${f.user || ""}">${f.name}</button>`).join("") + `</div>`);
          document.querySelectorAll("#nitStatus [data-sid]").forEach(b => b.addEventListener("click", () => {
            localStorage.setItem("pw_nit_service", b.dataset.sid); nitRun(b.dataset.sid);
          }));
          return;
        }
        sid = found[0].id; user = found[0].user;
        localStorage.setItem("pw_nit_service", sid);
      }
      if (!user){
        try { user = ((await nitApi("/services/" + sid + "/gameservers", token)).gameserver || {}).username; } catch(e){}
      }
      nitSay(`<div class="count-info">${ico("search",15)} Recherche du Level.sav…</div>`);
      const savPath = await nitFindSave(sid, user, token);
      localStorage.setItem("pw_nit_path", savPath);
      const file = await nitDownload(sid, savPath, token);
      if (!file) return; /* fallback CORS affiché */
      nitSay(`<div class="count-info">${ico("check",15)} Level.sav récupéré (${(file.size / 1048576).toFixed(1)} Mo) — analyse…</div>`);
      await window.__doImport(file);
      nitSay("");
    } catch (err){
      localStorage.removeItem("pw_nit_path");
      const m = /failed to fetch/i.test(err.message)
        ? "Connexion à api.nitrado.net impossible (« Failed to fetch »). Causes fréquentes : page ouverte en local (héberge le site), bloqueur de pub/VPN qui filtre la requête, ou coupure réseau."
        : err.message;
      nitSay(`<div class="warnbox">${m}</div>`);
    }
  }
}
/* ==================== INIT ==================== */
restoreHash();
