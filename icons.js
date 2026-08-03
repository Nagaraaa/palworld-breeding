"use strict";
/* ==================== JEU D'ICÔNES PAL-LAB ====================
   Icônes vectorielles maison, trait 1.6, cohérentes entre elles.
   Usage : ico("target") ou ico("map", 22) */
const ICONS = {
  home:    '<path d="M3 10.4 12 3l9 7.4"/><path d="M5.5 9.2V20h13V9.2"/><path d="M9.6 20v-5.6h4.8V20"/>',
  target:  '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3"/>',
  breed:   '<path d="M8.6 4.2a4.1 4.1 0 0 1 3.4 2 4.1 4.1 0 1 1 3.4 6.3"/><path d="M12 20.4S4.6 15.8 4.6 10.6A3.9 3.9 0 0 1 12 8.9a3.9 3.9 0 0 1 7.4 1.7c0 5.2-7.4 9.8-7.4 9.8Z"/>',
  path:    '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M6 8.6v4.2a4 4 0 0 0 4 4h5.4"/><path d="M13.4 14.4 16 17l-2.6 2.6"/>',
  spark:   '<path d="M12 2.6 14 9l6.4 2-6.4 2-2 6.4-2-6.4L3.6 11 10 9Z"/><path d="M18.4 3.2 19.2 5.6 21.6 6.4 19.2 7.2 18.4 9.6 17.6 7.2 15.2 6.4 17.6 5.6Z"/>',
  book:    '<path d="M4 4.6h5.6A2.8 2.8 0 0 1 12 7v13a2.4 2.4 0 0 0-2.4-2H4Z"/><path d="M20 4.6h-5.6A2.8 2.8 0 0 0 12 7v13a2.4 2.4 0 0 1 2.4-2H20Z"/>',
  dna:     '<path d="M7 2.6c0 5 10 5.4 10 10.4S7 18.4 7 21.4"/><path d="M17 2.6c0 5-10 5.4-10 10.4s10 5.4 10 8.4"/><path d="M8.4 7h7.2M7.6 11h8.8M8.4 17h7.2"/>',
  trophy:  '<path d="M7 4h10v5.4a5 5 0 0 1-10 0Z"/><path d="M7 5.6H4.4v1.8A3.4 3.4 0 0 0 7.4 10.7M17 5.6h2.6v1.8a3.4 3.4 0 0 1-3 3.3"/><path d="M12 14.4V18M8.6 21h6.8l-.8-3H9.4Z"/>',
  map:     '<path d="M9 4.2 3.6 6.4v13.4L9 17.6l6 2.2 5.4-2.2V4.2L15 6.4Z"/><path d="M9 4.2v13.4M15 6.4v13.4"/>',
  bag:     '<path d="M4.6 8.4h14.8l-1.1 11a1.9 1.9 0 0 1-1.9 1.7H7.6a1.9 1.9 0 0 1-1.9-1.7Z"/><path d="M8.8 8.4V6.2a3.2 3.2 0 0 1 6.4 0v2.2"/>',
  flask:   '<path d="M9.4 3h5.2M10.6 3v6.4L5.4 18a2.6 2.6 0 0 0 2.2 4h8.8a2.6 2.6 0 0 0 2.2-4l-5.2-8.6V3"/><path d="M7.6 14.6h8.8"/>',
  search:  '<circle cx="10.6" cy="10.6" r="6.6"/><path d="M15.4 15.4 21 21"/>',
  filter:  '<path d="M3.4 5.4h17.2l-6.6 7.8V20l-4-2.2v-4.6Z"/>',
  save:    '<path d="M5 3.4h11.2L20.6 8v12.6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.4a1 1 0 0 1 1-1Z"/><path d="M8 3.4v6h7v-6M8 15.6h8"/>',
  users:   '<circle cx="9" cy="8" r="3.4"/><path d="M3 20.4a6 6 0 0 1 12 0"/><path d="M16.4 5.2a3.4 3.4 0 0 1 0 5.8M17.6 14.6a6 6 0 0 1 3.4 5.4"/>',
  arrow:   '<path d="M4.6 12h14.8"/><path d="m13.4 6 6 6-6 6"/>',
  egg:     '<path d="M12 2.8c3.8 0 6.8 6 6.8 10.4a6.8 6.8 0 0 1-13.6 0C5.2 8.8 8.2 2.8 12 2.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"/>',
  moonx: '<path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5 8.6 8.6 0 1 0 20.5 14.4z"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 6M20 5v6h-6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  download: '<path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"/>',
  link: '<path d="M10 13a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 13 4.6l-1.7 1.7M14 11a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 11 19.4l1.7-1.7"/>',
  alert: '<path d="M12 3.5 22 20H2L12 3.5zM12 10v4.5M12 17.5v.5"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5.5-5.5 2 2-5.5 5.5-2z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9V16h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3z"/>',
  check: '<path d="m4 12.5 5.5 5.5L20 6.5"/>',
  sword: '<path d="M14.5 3H21v6.5L10 20.5 3.5 14 14.5 3zM6 17.5 3 21M14.5 9.5 17 12"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.4 3.1 7.9 7.5 9 4.4-1.1 7.5-4.6 7.5-9V6L12 3z"/>',
  hammer: '<path d="M15 3.5 20.5 9 17 12.5 11.5 7 15 3.5zM12.5 8 3 17.5 6.5 21 16 11.5"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
  wrench: '<path d="M20 6.5a5 5 0 0 1-6.6 6.4L5.6 20.7a2 2 0 0 1-2.8-2.8l7.8-7.8A5 5 0 0 1 17 3.5l-3 3 1.5 3.5L19 9.5l1-3z"/>',
  heart2: '<path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20z"/>',
  burst: '<path d="m12 2 2.5 6L21 7l-4 5 4 5-6.5-1L12 22l-2.5-6L3 17l4-5-4-5 6.5 1L12 2z"/>',
  orb: '<circle cx="12" cy="12" r="8"/><path d="M9 9.5a4 4 0 0 1 3-2"/>',
  horse: '<path d="M4 20c0-5 3-8 7-8V8l4-4 3 3-2 2v3c2 1 3 3.5 3 8"/><path d="M8 12 5 9"/>',
  wave: '<path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 10.5 6 3h12l-2.5 7.5"/>',
  pick: '<path d="M3 21 12 12M5 9a11 11 0 0 1 14 0M12 12l3.5-3.5"/>',
  water: '<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/>',
  seed: '<path d="M12 21v-9M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 15c0-3-2.5-5-5.5-5 0 3 2.5 5 5.5 5z"/>',
  basket: '<path d="M4 9h16l-2 10.5H6L4 9zM8.5 9 11 3M15.5 9 13 3"/>',
  axe: '<path d="M14 3.5 20.5 10l-3 3-6.5-6.5 3-3zM11 10 3 18l3 3 8-8"/>',
  barrel: '<path d="M6.5 4h11v16h-11zM6.5 9.5h11M6.5 14.5h11"/>',
  potion: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
  snow: '<path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11"/>',
  box: '<path d="M3 8.5 12 3.5l9 5v7l-9 5-9-5v-7zM3 8.5l9 5 9-5M12 13.5v10"/>',
  crown: '<path d="M4 18h16M4 18 3 7l5 4 4-6 4 6 5-4-1 11"/>',
  tower: '<path d="M9 21V9l3-6 3 6v12M6 21h12M9 13h6"/>',
  meat: '<path d="M15.5 4a5.5 5.5 0 0 1 3.4 9.4L9 20 4 15l6.6-9.4A5.5 5.5 0 0 1 15.5 4z"/>',
  fang: '<path d="M4 5h16v6a9 9 0 0 1-4 7.5L14 22l-2-4-2 4-2-3.5A9 9 0 0 1 4 11V5z"/>',
};
function ico(name, size){
  const d = ICONS[name] || "";
  const s = size || 20;
  return `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}
/* remplace les marqueurs [[ico:nom]] présents dans le HTML au chargement */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-ico]").forEach(el => {
    el.insertAdjacentHTML("afterbegin", ico(el.dataset.ico, +el.dataset.icoSize || 20));
  });
});
