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
  egg:     '<path d="M12 2.8c3.8 0 6.8 6 6.8 10.4a6.8 6.8 0 0 1-13.6 0C5.2 8.8 8.2 2.8 12 2.8Z"/>'
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
