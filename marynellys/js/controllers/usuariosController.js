/* ==========================================================
   CONTROLADOR: usuarios y roles (agregar, editar, activar, eliminar)
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const UsuariosController = {
  init() {
    function renderUsuarios() {
      $('#ub').innerHTML = usuarios.map((u, i) => `<tr>
        <td data-l="Nombre"><b>${esc(u.n)}</b></td><td data-l="Correo">${esc(u.e)}</td><td data-l="Rol">${esc(u.r)}</td>
        <td data-l="Estado"><label class="sw"><input type="checkbox" data-t="${i}" ${u.on ? 'checked' : ''}> ${u.on ? 'Activo' : 'Inactivo'}</label></td>
        <td class="act"><button data-e="${i}" aria-label="Editar ${esc(u.n)}">Editar</button><button class="del" data-x="${i}" aria-label="Eliminar ${esc(u.n)}">Eliminar</button></td></tr>`).join('');
      $('#uempty').hidden = usuarios.length > 0;
      $('#utabla').hidden = usuarios.length === 0;
    }

    $('#nu').addEventListener('click', async () => {
      const datos = await ModalView.formulario({ titulo: 'Nuevo usuario', campos: UsuariosModel.campos(), textoSi: 'Crear usuario' });
      if (!datos) return;
      UsuariosModel.agregar(datos); renderUsuarios(); toast('Usuario creado');
    });

    $('#ub').addEventListener('change', (e) => {
      if (e.target.dataset.t === undefined) return;
      UsuariosModel.activar(+e.target.dataset.t, e.target.checked); renderUsuarios();
      toast(e.target.checked ? 'Usuario activado' : 'Usuario desactivado');
    });

    $('#ub').addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.e !== undefined) {
        const i = +b.dataset.e;
        const datos = await ModalView.formulario({ titulo: 'Editar usuario', campos: UsuariosModel.campos(i), valores: usuarios[i], textoSi: 'Guardar cambios' });
        if (!datos) return;
        UsuariosModel.actualizar(i, datos); renderUsuarios(); toast('Cambios guardados');
      }
      if (b.dataset.x !== undefined) {
        const i = +b.dataset.x;
        ask('¿Eliminar este usuario?', `Vas a eliminar a "${esc(usuarios[i].n)}". Esta acción no se puede deshacer.`, () => { UsuariosModel.eliminar(i); renderUsuarios(); toast('Usuario eliminado'); });
      }
    });

    Store.alCambiar('usuarios', () => { UsuariosModel.recargar(); renderUsuarios(); });
    renderUsuarios();
  }
};
