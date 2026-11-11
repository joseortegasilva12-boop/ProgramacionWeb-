/* ==========================================================
   MODELO: mesas, pedido de cada mesa y cobro (no toca el DOM)
   Los métodos reciben el NÚMERO de mesa y recargan los datos antes de
   cambiarlos, así no se pisan los cambios de otra pestaña (cocina, caja).
   ========================================================== */
const MesasModel = {
  SERVICIO: 0.10,

  recargar() { mesas = Store.cargar('mesas', []); },
  guardar() { Store.guardar('mesas', mesas); },
  buscar: (n) => mesas.find((m) => m.n === n),
  existe: (n) => mesas.some((m) => m.n === n),

  campos() {
    return [
      { name: 'n', label: 'Número de mesa', type: 'number', rules: 'required|entero', placeholder: '1', extra: (v) => MesasModel.existe(Number(v)) ? 'Ya existe la mesa ' + Number(v) + '.' : '' },
      { name: 'p', label: 'Puestos', type: 'number', rules: 'required|entero', placeholder: '4' }
    ];
  },

  agregar({ n, p }) {
    MesasModel.recargar();
    mesas.push({ n, p, s: 'Libre', items: [] });
    mesas.sort((a, b) => a.n - b.n);
    MesasModel.guardar();
  },

  abrir(n) { MesasModel.recargar(); const m = MesasModel.buscar(n); if (m && m.s === 'Libre') { m.s = 'Ocupada'; MesasModel.guardar(); } },

  agregarItem(n, plato) {
    MesasModel.recargar();
    const m = MesasModel.buscar(n); if (!m || m.s !== 'Ocupada') return;
    const it = m.items.find((i) => i.n === plato.n);
    if (it) it.q++; else m.items.push({ n: plato.n, q: 1, e: 0, p: plato.p });
    MesasModel.guardar();
  },

  // Resta 1. No deja bajar de lo que ya se envió a cocina.
  quitarItem(n, idx) {
    MesasModel.recargar();
    const m = MesasModel.buscar(n); if (!m || m.s !== 'Ocupada') return;
    const it = m.items[idx]; if (!it || it.q <= it.e) return;
    it.q--; if (it.q === 0) m.items.splice(idx, 1);
    MesasModel.guardar();
  },

  pendientes: (m) => m.items.filter((i) => i.q > i.e),

  // Manda a cocina lo que aún no se ha enviado. Devuelve true si envió algo.
  enviarACocina(n, nota) {
    MesasModel.recargar();
    const m = MesasModel.buscar(n); if (!m) return false;
    const pend = MesasModel.pendientes(m); if (!pend.length) return false;
    ComandasModel.crear('Mesa ' + m.n, pend.map((i) => `${i.q - i.e}× ${i.n}`), nota);
    pend.forEach((i) => { i.e = i.q; });
    MesasModel.guardar();
    return true;
  },

  // Cierra una mesa abierta que no tiene pedido (por si se abrió por error)
  liberar(n) { MesasModel.recargar(); const m = MesasModel.buscar(n); if (m && m.s === 'Ocupada' && !m.items.length) { m.s = 'Libre'; MesasModel.guardar(); } },
  // Solo se puede eliminar una mesa libre
  eliminar(n) { MesasModel.recargar(); const m = MesasModel.buscar(n); if (m && m.s === 'Libre') { mesas.splice(mesas.indexOf(m), 1); MesasModel.guardar(); } },

  pedirCuenta(n) { MesasModel.recargar(); const m = MesasModel.buscar(n); if (m && m.s === 'Ocupada' && m.items.length) { m.s = 'Por cobrar'; MesasModel.guardar(); } },

  subtotal: (m) => m.items.reduce((s, i) => s + i.q * i.p, 0),
  servicio: (m, conServicio) => conServicio ? Math.round(MesasModel.subtotal(m) * MesasModel.SERVICIO) : 0,
  total: (m, conServicio) => MesasModel.subtotal(m) + MesasModel.servicio(m, conServicio),

  // Mesas con cuenta abierta (las "Por cobrar" primero)
  porCobrar() {
    return mesas.filter((m) => m.s !== 'Libre' && m.items.length)
      .sort((a, b) => (a.s === 'Por cobrar' ? 0 : 1) - (b.s === 'Por cobrar' ? 0 : 1) || a.n - b.n);
  },

  // Registra la venta y deja la mesa libre. Devuelve el total cobrado, o null si la mesa ya no tiene cuenta.
  cobrar(n, metodo, conServicio) {
    MesasModel.recargar();
    const m = MesasModel.buscar(n); if (!m || !m.items.length) return null;
    const total = MesasModel.total(m, conServicio);
    VentasModel.registrar({ m: 'Mesa ' + m.n, p: m.items.map((i) => `${i.q}× ${i.n}`).join(', '), mp: metodo, t: total, i: m.items.map((i) => ({ n: i.n, q: i.q })) });
    m.items = []; m.s = 'Libre';
    MesasModel.guardar();
    return total;
  }
};
