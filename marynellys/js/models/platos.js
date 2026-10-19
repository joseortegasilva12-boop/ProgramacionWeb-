/* ==========================================================
   MODELO: reglas de los platos del menú (no toca el DOM)
   ========================================================== */
const PlatosModel = {
  categorias: ['Entrada', 'Plato fuerte', 'Bebida'],

  recargar() { platos = Store.cargar('platos', []); },
  guardar() { Store.guardar('platos', platos); },

  // ¿ya existe otro plato con ese nombre? (ignorar = posición que se está editando)
  existe(nombre, ignorar = -1) {
    const q = nombre.trim().toLowerCase();
    return platos.some((p, i) => i !== ignorar && p.n.toLowerCase() === q);
  },
  agregar({ n, d, c, p }) { platos.push({ n, d, c, p, on: 1 }); PlatosModel.guardar(); },
  actualizar(i, { n, d, c, p }) { Object.assign(platos[i], { n, d, c, p }); PlatosModel.guardar(); },
  disponibilidad(i, on) { platos[i].on = on ? 1 : 0; PlatosModel.guardar(); },
  eliminar(i) { platos.splice(i, 1); PlatosModel.guardar(); },

  // Campos del formulario (sirve para crear y para editar)
  campos(ignorar = -1) {
    return [
      { name: 'n', label: 'Nombre del plato', rules: 'required', placeholder: 'Ej. Bandeja paisa', extra: (v) => PlatosModel.existe(v, ignorar) ? 'Ya existe un plato con ese nombre.' : '' },
      { name: 'd', label: 'Descripción', type: 'textarea', rules: 'required', placeholder: 'Ingredientes o cómo se sirve' },
      { name: 'c', label: 'Categoría', type: 'select', opciones: PlatosModel.categorias },
      { name: 'p', label: 'Precio (COP)', type: 'number', rules: 'required|positivo', placeholder: '25000' }
    ];
  }
};
