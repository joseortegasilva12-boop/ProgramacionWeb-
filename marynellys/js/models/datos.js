/* ==========================================================
   DATOS: listas del sistema + guardado en el navegador (localStorage)
   Así lo que se agrega en una página se ve en las demás.
   ========================================================== */
const Store = {
  prefijo: 'marynellys.',
  cargar(clave, defecto) {
    try { const t = localStorage.getItem(Store.prefijo + clave); return t ? JSON.parse(t) : defecto; }
    catch (e) { return defecto; }
  },
  guardar(clave, valor) {
    try { localStorage.setItem(Store.prefijo + clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento: sigue en memoria */ }
  },
  // Avisa cuando OTRA pestaña cambió esa lista (ej. cocina ve lo que manda el camarero)
  alCambiar(clave, fn) {
    window.addEventListener('storage', (e) => { if (e.key === Store.prefijo + clave) fn(); });
  }
};

/* Cada lista empieza vacía. */
let ins = Store.cargar('ins', []);                           // { n, c, q, u, m, p, v }   nombre, categoría, cantidad, unidad, stock mínimo, costo, proveedor
let platos = Store.cargar('platos', []);   // { n, d, c, p, on }        nombre, descripción, categoría, precio, disponible (1/0)
let mesas = Store.cargar('mesas', []);     // { n, p, s, items }        número, puestos, estado: 'Libre' | 'Ocupada' | 'Por cobrar'
let com = Store.cargar('com', []);         // { m, id, s, ts, items, nota }  mesa, número, estado (0 pendiente, 1 preparando, 2 listo), hora de creación, texto de items
let ventas = Store.cargar('ventas', []);   // { f, m, p, mp, t, i }     fecha 'AAAA-MM-DD', mesa, productos (texto), método de pago, total, i = [{ n, q }] para los reportes
let usuarios = Store.cargar('usuarios', []); // { n, e, r, on }         nombre, correo, rol, activo (1/0)
// items de mesas: [{ n: 'Bandeja paisa', q: 2, e: 1, p: 34900 }]  → nombre, cantidad, cuántos ya se enviaron a cocina, precio unitario
// items de com: ['1× Bandeja paisa']
