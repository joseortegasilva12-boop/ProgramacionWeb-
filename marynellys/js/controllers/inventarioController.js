/* ==========================================================
   CONTROLADOR: eventos del listado de inventario
   ========================================================== */
const InventarioController = {
  mostrar() { InventarioView.filas(InsumosModel.buscar($('#q').value, $('#cat').value)); },

  init() {
    $('#q').addEventListener('input', InventarioController.mostrar);
    $('#cat').addEventListener('change', InventarioController.mostrar);
    $('#new').addEventListener('click', () => { location.href = 'insumo-form.html'; });

    $('#tb').addEventListener('click', async (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      if (boton.dataset.e) location.href = 'insumo-form.html?id=' + boton.dataset.e;
      if (boton.dataset.d) {
        const i = +boton.dataset.d;
        const ok = await ModalView.confirmar(`Vas a eliminar "${ins[i].n}" del inventario. Esta acción no se puede deshacer.`, '¿Eliminar este insumo?');
        if (ok) { InsumosModel.eliminar(i); InventarioController.mostrar(); ModalView.aviso('Insumo eliminado'); }
      }
    });

    const ok = new URLSearchParams(location.search).get('ok');
    if (ok) ModalView.aviso(ok === 'nuevo' ? 'Insumo guardado correctamente' : 'Cambios guardados');
    InventarioController.mostrar();
  }
};
