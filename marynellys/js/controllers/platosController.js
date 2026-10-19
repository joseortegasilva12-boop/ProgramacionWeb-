/* ==========================================================
   CONTROLADOR: gestión de platos (agregar, editar, disponibilidad, eliminar)
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const PlatosController = {
  init() {
    function renderPlatos() {
      $('#pl').innerHTML = platos.map((p, i) => `<div class="li"><div class="ph"></div><div class="grow"><b>${esc(p.n)}</b><br><small class="sub">${esc(p.c)} · ${money(p.p)}</small></div>
        <label class="sw"><input type="checkbox" data-t="${i}" ${p.on ? 'checked' : ''}> Disponible hoy</label>
        <button class="btn sec" data-e="${i}">Editar</button><button class="btn sec" style="color:var(--er)" data-x="${i}">Eliminar</button></div>`).join('');
    }

    $('#np').addEventListener('click', async () => {
      const datos = await ModalView.formulario({ titulo: 'Nuevo plato', campos: PlatosModel.campos(), textoSi: 'Agregar al menú' });
      if (!datos) return;
      PlatosModel.agregar(datos); renderPlatos(); toast('Plato agregado al menú');
    });

    $('#pl').addEventListener('change', (e) => {
      if (e.target.dataset.t === undefined) return;
      PlatosModel.disponibilidad(+e.target.dataset.t, e.target.checked);
      toast(e.target.checked ? 'Plato disponible hoy' : 'Plato marcado como agotado');
    });

    $('#pl').addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.e !== undefined) {
        const i = +b.dataset.e;
        const datos = await ModalView.formulario({ titulo: 'Editar plato', campos: PlatosModel.campos(i), valores: platos[i], textoSi: 'Guardar cambios' });
        if (!datos) return;
        PlatosModel.actualizar(i, datos); renderPlatos(); toast('Cambios guardados');
      }
      if (b.dataset.x !== undefined) {
        const i = +b.dataset.x;
        ask('¿Eliminar este plato?', `Vas a eliminar "${esc(platos[i].n)}" del menú. Esta acción no se puede deshacer.`, () => { PlatosModel.eliminar(i); renderPlatos(); toast('Plato eliminado'); });
      }
    });

    // Si cambian los platos desde otra pestaña, se actualiza la lista
    Store.alCambiar('platos', () => { PlatosModel.recargar(); renderPlatos(); });
    renderPlatos();
  }
};
