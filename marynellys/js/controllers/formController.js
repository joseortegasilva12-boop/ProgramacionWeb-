/* ==========================================================
   CONTROLADOR: formulario de insumo (registrar y editar)
   ========================================================== */
const FormController = {
  init() {
    const form = document.getElementById('f');
    const campos = [...form.querySelectorAll('[data-rules]')];
    const validar = (campo) => {
      const error = Validator.validar(campo.value, campo.dataset.rules);
      FormView.mostrarError(campo, error);
      return !error;
    };

    // Si la dirección trae ?id=N, se está editando ese insumo
    const id = new URLSearchParams(location.search).get('id');
    const editando = id !== null && ins[+id] !== undefined;
    if (editando) {
      FormView.llenar(form, ins[+id]);
      document.getElementById('ft').textContent = 'Editar insumo';
    }

    campos.forEach((c) => c.addEventListener('input', () => validar(c)));
    document.getElementById('cancel').addEventListener('click', () => { location.href = 'inventario.html'; });
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const todoBien = campos.map(validar).every(Boolean);
      FormView.resumen(form, !todoBien);
      if (!todoBien) return FormView.enfocarPrimerError(form);
      // Se arma el insumo con los valores del formulario y se guarda
      const datos = {};
      [...form.elements].filter((c) => c.name).forEach((c) => { const v = c.value.trim(); datos[c.name] = c.type === 'number' ? Number(v) : v; });
      if (editando) InsumosModel.actualizar(+id, datos); else InsumosModel.agregar(datos);
      location.href = 'inventario.html?ok=' + (editando ? 'editado' : 'nuevo');
    });
  }
};
