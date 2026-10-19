/* ==========================================================
   MODELO: ventas, filtros, totales y resúmenes
   ========================================================== */
const VentasModel = {
  metodos: ['Efectivo', 'Nequi', 'Tarjeta'],

  recargar() { ventas = Store.cargar('ventas', []); },

  // Fecha de hoy 'AAAA-MM-DD' en hora local (no UTC, para que no cambie de día a las 7 pm)
  hoy() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  registrar({ m, p, mp, t, i = [] }) {
    VentasModel.recargar();
    ventas.push({ f: VentasModel.hoy(), m, p, mp, t, i });
    Store.guardar('ventas', ventas);
  },

  // Las más recientes primero
  filtrar({ texto, desde, hasta, metodo }) {
    const q = texto.toLowerCase().trim();
    return ventas.filter((v) => (!desde || v.f >= desde) && (!hasta || v.f <= hasta) && (!metodo || v.mp === metodo) && (v.m + ' ' + v.p).toLowerCase().includes(q)).reverse();
  },
  total: (lista) => lista.reduce((suma, v) => suma + v.t, 0),

  // Resumen de una lista de ventas: cantidad, total, promedio y desglose por método de pago
  resumen(lista) {
    const total = VentasModel.total(lista);
    return {
      n: lista.length,
      total,
      promedio: lista.length ? Math.round(total / lista.length) : 0,
      metodos: VentasModel.metodos.map((mp) => { const l = lista.filter((v) => v.mp === mp); return { mp, n: l.length, total: VentasModel.total(l) }; })
    };
  },
  resumenHoy() { return VentasModel.resumen(ventas.filter((v) => v.f === VentasModel.hoy())); },
  resumenPeriodo() {
    const r = VentasModel.resumen(ventas);
    r.desde = ventas.length ? ventas.reduce((min, v) => (v.f < min ? v.f : min), ventas[0].f) : '';
    return r;
  }
};
