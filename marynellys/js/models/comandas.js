/* ==========================================================
   MODELO: comandas de cocina (0 pendiente → 1 preparando → 2 listo)
   ========================================================== */
const ComandasModel = {
  estados: ['Pendiente', 'Preparando', 'Listo'],

  recargar() { com = Store.cargar('com', []); },
  guardar() { Store.guardar('com', com); },

  // Crea una comanda nueva en estado Pendiente
  crear(mesa, items, nota) {
    ComandasModel.recargar();
    const id = Store.cargar('comSeq', 0) + 1;
    Store.guardar('comSeq', id);
    com.push({ m: mesa, id, s: 0, ts: Date.now(), items, nota });
    ComandasModel.guardar();
  },

  // Pendiente → Preparando → Listo → (entregado: sale de la lista)
  avanzar(id) {
    ComandasModel.recargar();
    const x = com.find((c) => c.id === id);
    if (!x) return;
    if (x.s < 2) x.s++; else com.splice(com.indexOf(x), 1);
    ComandasModel.guardar();
  },

  // Borra todo lo que está en la columna Listo. Devuelve cuántas borró.
  limpiarListos() {
    ComandasModel.recargar();
    const antes = com.length;
    com = com.filter((c) => c.s !== 2);
    ComandasModel.guardar();
    return antes - com.length;
  },

  minutos: (x) => Math.max(0, Math.floor((Date.now() - (x.ts || Date.now())) / 60000))
};
