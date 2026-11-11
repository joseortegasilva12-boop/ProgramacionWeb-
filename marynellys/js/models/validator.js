/* ==========================================================
   MODELO: reglas de validación (no toca el DOM)
   ========================================================== */
const Validator = {
  reglas: {
    required: (valor) => valor.trim() !== '' || 'Este campo es obligatorio.',
    number: (valor) => valor === '' || (!isNaN(valor) && Number(valor) >= 0) || 'Debe ser un número igual o mayor a 0.',
    positivo: (valor) => valor === '' || (!isNaN(valor) && Number(valor) > 0) || 'Debe ser un número mayor a 0.',
    entero: (valor) => valor === '' || (Number.isInteger(Number(valor)) && Number(valor) > 0) || 'Debe ser un número entero mayor a 0.',
    email: (valor) => valor === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) || 'Escribe un correo válido.'
  },

  // Recibe el valor y una lista como "required|number". Devuelve el primer error o '' si todo está bien.
  validar(valor, listaReglas) {
    for (const regla of listaReglas.split('|')) {
      const [nombre, argumento] = regla.split(':');
      const resultado = Validator.reglas[nombre](valor, argumento);
      if (resultado !== true) return resultado;
    }
    return '';
  }
};
