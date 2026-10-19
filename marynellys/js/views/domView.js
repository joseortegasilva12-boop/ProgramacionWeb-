/* ==========================================================
   VISTA: atajos para el DOM y formato de dinero
   ========================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) => '$' + Number(n).toLocaleString('es-CO');
// Evita que un texto escrito por el usuario se interprete como HTML
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
