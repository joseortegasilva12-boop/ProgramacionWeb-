/* ==========================================================
   VISTA: errores y datos en los formularios
   ========================================================== */
const FormView = {
  mostrarError(campo, mensaje) {
    campo.classList.toggle('bad', !!mensaje);
    campo.setAttribute('aria-invalid', !!mensaje);
    campo.parentElement.querySelector('.err').textContent = mensaje;
  },
  resumen(form, hayErrores) { form.querySelector('.alert').hidden = !hayErrores; },
  enfocarPrimerError(form) { const c = form.querySelector('.bad'); if (c) c.focus(); },
  llenar(form, datos) {
    for (const [nombre, valor] of Object.entries(datos)) { if (form.elements[nombre]) form.elements[nombre].value = valor; }
  }
};
