/* ==========================================================
   PUNTO DE ENTRADA: arranca todo según la página actual
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const { page, root } = document.body.dataset;

  ShellView.render(page, root);
  ShellController.init();

  // Solo se inician los controladores que esa página cargó
  if (typeof FormController !== 'undefined')        FormController.init();
  if (typeof InventarioController !== 'undefined')  InventarioController.init();
  if (typeof VentasController !== 'undefined')      VentasController.init();
  if (typeof MenuClienteController !== 'undefined') MenuClienteController.init();
  if (typeof PlatosController !== 'undefined')      PlatosController.init();
  if (typeof MesasController !== 'undefined')       MesasController.init();
  if (typeof CocinaController !== 'undefined')      CocinaController.init();
  if (typeof CajaController !== 'undefined')        CajaController.init();
  if (typeof ReportesController !== 'undefined')   ReportesController.init();
  if (typeof UsuariosController !== 'undefined')    UsuariosController.init();
});
