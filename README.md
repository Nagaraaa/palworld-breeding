# 🧪 Pal-Lab — le compagnon Palworld de ta guilde

Créé par **Nagara**.

Site statique, aucun build : https://palworld-breeding-mocha.vercel.app

## Fonctions
- **Je veux ce pal** — toutes les paires de parents pour un enfant donné, filtrables « avec mes pals », + chemin le plus court depuis ta collection
- **Croiser** — l'enfant de deux parents (combos spéciaux et couple selon genre inclus)
- **Chemin** — nombre minimal de croisements entre deux pals
- **Combos** — les 82 combos spéciaux et les pals uniques
- **Paldex** — 300 pals : éléments, aptitudes de travail, stats, rareté, prix
- **Passifs** — les 114 compétences passives (FR), filtrables par rang et par effet
- **Meta** — 15 builds de 4 passifs par rôle (ouvrier, ranch, élevage, combat, tank, montures, soutien joueur) avec les pals conseillés
- **Carte** — ~1 150 points d'intérêt (voyage rapide, tours, statues, donjons, alphas, prédateurs, reliques) avec coordonnées in-game
- **Mes Pals** — import de sauvegarde (solo, serveur dédié, API Nitrado), plan d'élevage, export pour la guilde

## Structure
| Fichier | Rôle |
|---|---|
| `index.html` | structure de la page |
| `style.css` | styles & animations |
| `data.js` | données d'élevage v1.0 (300 pals, 270 combos spéciaux) |
| `core.js` | moteur de breeding + Web Worker |
| `ui.js` | onglets élevage, Mes Pals, combos |
| `paldex.js` | Paldex et passifs |
| `meta.js` | builds meta par rôle |
| `map.js` | carte interactive |
| `import.js` | parseur de sauvegardes + import Nitrado |
| `passives.js` | 114 passifs FR |
| `ooz.js` | décodeur Oodle WebAssembly |

## Sources & licences
- Données d'élevage : fichiers du jeu v1.0 (via [palworld.kimpton.io](https://palworld.kimpton.io)), vérifiées sur les 88 804 paires
- Paldex & points d'intérêt : [palworld-save-pal](https://github.com/oMaN-Rod/palworld-save-pal) (MIT), chargés à la demande via jsDelivr
- Passifs FR : [paldb.cc](https://paldb.cc)
- Conversion de coordonnées : [palworld-coord](https://github.com/palworldlol/palworld-coord)
- Décodeur Oodle : [ooz-wasm](https://github.com/SnosMe/ooz-wasm) (GPL-3.0)

Pour afficher un vrai fond de carte, dépose une image `map.jpg` à la racine. Outil non-officiel — Palworld © Pocketpair.
