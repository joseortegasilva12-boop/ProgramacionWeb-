/* ==========================================================
   MODELO: reglas del inventario (no toca el DOM)
   ========================================================== */
const InsumosModel = {
  buscar(texto, categoria) {
    const q = texto.toLowerCase().trim();
    return ins.map((r, i) => ({ r, i }))
      .filter(({ r }) => (!categoria || r.c === categoria) && (r.n + ' ' + r.v).toLowerCase().includes(q));
  },
  esBajo: (r) => r.q < r.m,
  guardar() { Store.guardar('ins', ins); },
  agregar(datos) { ins.push(datos); InsumosModel.guardar(); },
  actualizar(i, datos) { ins[i] = datos; InsumosModel.guardar(); },
  eliminar(i) { ins.splice(i, 1); InsumosModel.guardar(); }
};
