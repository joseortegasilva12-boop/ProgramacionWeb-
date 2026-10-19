/* ==========================================================
   MODELO: cifras del reporte del día (sale de ventas, mesas e inventario)
   ========================================================== */
const ReportesModel = {
  ventasHoy: () => ventas.filter((v) => v.f === VentasModel.hoy()),

  // Platos más vendidos hoy: suma las cantidades de cada venta
  masVendidos(lista, limite = 5) {
    const cuenta = {};
    lista.forEach((v) => (v.i || []).forEach((it) => { cuenta[it.n] = (cuenta[it.n] || 0) + it.q; }));
    return Object.entries(cuenta).map(([n, q]) => ({ n, q })).sort((a, b) => b.q - a.q).slice(0, limite);
  },

  // Insumos con cantidad por debajo del mínimo, los más críticos primero
  porAgotarse() {
    return ins.filter(InsumosModel.esBajo).sort((a, b) => a.q / (a.m || 1) - b.q / (b.m || 1));
  },

  resumenDia() {
    const lista = ReportesModel.ventasHoy(), r = VentasModel.resumen(lista);
    return { ...r, mesas: new Set(lista.map((v) => v.m)).size };
  }
};
