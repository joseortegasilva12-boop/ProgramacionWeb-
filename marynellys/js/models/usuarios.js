/* ==========================================================
   MODELO: usuarios y roles del equipo (no toca el DOM)
   ========================================================== */
const UsuariosModel = {
  roles: ['Administrador', 'Camarero', 'Cocina', 'Cajero'],

  guardar() { Store.guardar('usuarios', usuarios); },
  recargar() { usuarios = Store.cargar('usuarios', []); },

  existeCorreo(correo, ignorar = -1) {
    const q = correo.trim().toLowerCase();
    return usuarios.some((u, i) => i !== ignorar && u.e.toLowerCase() === q);
  },
  agregar({ n, e, r }) { usuarios.push({ n, e, r, on: 1 }); UsuariosModel.guardar(); },
  actualizar(i, { n, e, r }) { Object.assign(usuarios[i], { n, e, r }); UsuariosModel.guardar(); },
  activar(i, on) { usuarios[i].on = on ? 1 : 0; UsuariosModel.guardar(); },
  eliminar(i) { usuarios.splice(i, 1); UsuariosModel.guardar(); },

  campos(ignorar = -1) {
    return [
      { name: 'n', label: 'Nombre completo', rules: 'required', placeholder: 'Ej. Ana Pérez' },
      { name: 'e', label: 'Correo', type: 'email', rules: 'required|email', placeholder: 'ana@correo.com', extra: (v) => UsuariosModel.existeCorreo(v, ignorar) ? 'Ya hay un usuario con ese correo.' : '' },
      { name: 'r', label: 'Rol', type: 'select', opciones: UsuariosModel.roles }
    ];
  }
};
