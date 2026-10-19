/* ==========================================================
   VISTA: ventana de confirmación y avisos
   ========================================================== */
const ModalView = {
  // Devuelve una promesa: true si confirma, false si cancela
  confirmar(mensaje, titulo = '¿Estás seguro?', textoSi = 'Sí, eliminar') {
    return new Promise((resolver) => {
      const modal = document.createElement('div');
      modal.className = 'ov';
      modal.innerHTML = `
        <div class="card md" role="dialog" aria-modal="true">
          <h2>${titulo}</h2><p class="sub">${mensaje}</p>
          <div class="acts">
            <button class="btn sec" data-respuesta="no">Cancelar</button>
            <button class="btn dg" data-respuesta="si">${textoSi}</button>
          </div>
        </div>`;
      const cerrar = (respuesta) => { modal.remove(); document.removeEventListener('keydown', alEscape); resolver(respuesta); };
      const alEscape = (e) => { if (e.key === 'Escape') cerrar(false); };
      modal.addEventListener('click', (e) => {
        const r = e.target.dataset.respuesta;
        if (r) cerrar(r === 'si'); else if (e.target === modal) cerrar(false);
      });
      document.addEventListener('keydown', alEscape);
      document.body.append(modal);
      modal.querySelector('[data-respuesta="no"]').focus();
    });
  },

  /* Formulario en ventana. Devuelve una promesa con los valores, o null si cancela.
     campos: [{ name, label, type: 'text'|'number'|'email'|'select'|'textarea', rules: 'required|positivo', opciones: [], placeholder, extra: (valor) => 'mensaje de error' | '' }] */
  formulario({ titulo, campos, valores = {}, textoSi = 'Guardar' }) {
    return new Promise((resolver) => {
      const modal = document.createElement('div');
      modal.className = 'ov';
      const control = (c) => {
        const v = valores[c.name] ?? '';
        const id = `mf-${c.name}`;
        if (c.type === 'select') return `<select id="${id}" name="${c.name}">${c.opciones.map((o) => `<option${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
        if (c.type === 'textarea') return `<textarea id="${id}" name="${c.name}" placeholder="${esc(c.placeholder || '')}">${esc(v)}</textarea>`;
        return `<input id="${id}" name="${c.name}" type="${c.type || 'text'}" ${c.type === 'number' ? 'min="0" step="any"' : ''} value="${esc(v)}" placeholder="${esc(c.placeholder || '')}">`;
      };
      modal.innerHTML = `
        <form class="card md" role="dialog" aria-modal="true" novalidate>
          <h2>${titulo}</h2>
          ${campos.map((c) => `<div class="fl"><label for="mf-${c.name}">${c.label}</label>${control(c)}<small class="err"></small></div>`).join('')}
          <div class="acts">
            <button type="button" class="btn sec" data-respuesta="no">Cancelar</button>
            <button type="submit" class="btn">${textoSi}</button>
          </div>
        </form>`;
      const form = modal.querySelector('form');
      const validar = (c) => {
        const el = form.elements[c.name];
        const valor = el.value;
        const error = (c.rules ? Validator.validar(valor, c.rules) : '') || (c.extra ? c.extra(valor.trim()) : '');
        FormView.mostrarError(el, error);
        return !error;
      };
      const cerrar = (respuesta) => { modal.remove(); document.removeEventListener('keydown', alEscape); resolver(respuesta); };
      const alEscape = (e) => { if (e.key === 'Escape') cerrar(null); };
      campos.forEach((c) => form.elements[c.name].addEventListener('input', () => validar(c)));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!campos.map(validar).every(Boolean)) { const mal = form.querySelector('.bad'); if (mal) mal.focus(); return; }
        const datos = {};
        campos.forEach((c) => { const v = form.elements[c.name].value.trim(); datos[c.name] = c.type === 'number' ? Number(v) : v; });
        cerrar(datos);
      });
      modal.querySelector('[data-respuesta="no"]').addEventListener('click', () => cerrar(null));
      document.addEventListener('keydown', alEscape);
      document.body.append(modal);
      form.elements[campos[0].name].focus();
    });
  },

  aviso(texto) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = texto;
    t.classList.add('show');
    clearTimeout(ModalView.temporizador);
    ModalView.temporizador = setTimeout(() => t.classList.remove('show'), 2200);
  }
};

// Atajos para las páginas que todavía tienen vista y controlador juntos
const toast = (texto) => ModalView.aviso(texto);
const ask = (titulo, texto, fn) => ModalView.confirmar(texto, titulo).then((ok) => ok && fn());
