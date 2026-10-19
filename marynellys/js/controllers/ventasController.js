/* ==========================================================
   CONTROLADOR: filtros y resumen del historial de ventas
   ========================================================== */
const VentasController = {
  mostrar() {
    VentasView.resumen(VentasModel.resumenHoy(), VentasModel.resumenPeriodo());   // el resumen no depende de los filtros
    VentasView.filas(VentasModel.filtrar({ texto: $('#vq').value, desde: $('#vd').value, hasta: $('#vh').value, metodo: $('#vm').value }));
  },
  init() {
    ['#vq', '#vd', '#vh'].forEach((s) => $(s).addEventListener('input', VentasController.mostrar));
    $('#vm').addEventListener('change', VentasController.mostrar);
    // Cuando caja registra una venta (otra pestaña), se actualiza sola
    Store.alCambiar('ventas', () => { VentasModel.recargar(); VentasController.mostrar(); });
    VentasController.mostrar();
  }
};
