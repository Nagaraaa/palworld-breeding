# Palworld — Calculateur de Reproduction

Site statique (aucun build) : https://palworld-breeding-mocha.vercel.app

## Structure
- `index.html` — structure de la page
- `style.css` — styles & animations
- `data.js` — données du jeu v1.0 (300 pals, puissances d'élevage, 270 combos spéciaux, correspondance noms internes)
- `core.js` — moteur de breeding + Web Worker (index des 44 552 paires, fermetures transitives)
- `ui.js` — onglets, sélecteurs, croisement, parents, chemin le plus court, Mes Pals, combos
- `import.js` — parseur de sauvegardes (conteneurs PlZ/zlib et PlM1/Oodle, GVAS), import Nitrado, export guilde
- `ooz.js` — décodeur Oodle en WebAssembly ([ooz-wasm](https://github.com/SnosMe/ooz-wasm), GPL-3.0)

Données extraites des fichiers du jeu (via palworld.kimpton.io), vérifiées sur les 88 804 paires. Outil non-officiel — Palworld © Pocketpair.
