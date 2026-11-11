/* ==========================================================
   CONTROLADOR: menú lateral desplegable y botones "próxima entrega"
   ========================================================== */
const ShellController = {
  init() {
    const lateral = document.getElementById('side');
    document.getElementById('burger').addEventListener('click', () => lateral.classList.toggle('open'));
    document.querySelector('main').addEventListener('click', () => lateral.classList.remove('open'));
    document.querySelectorAll('[data-soon]').forEach((b) => b.addEventListener('click', () => ModalView.aviso('Disponible en la siguiente entrega')));
  }
};
