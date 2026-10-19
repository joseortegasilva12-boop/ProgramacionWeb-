/* ==========================================================
   CONTROLADOR: menú del cliente (solo para ver)
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const MenuClienteController = {
  init() {
    let mcat = '';
    function renderMenu() {
      $('#mg').innerHTML = platos.filter((p) => !mcat || p.c === mcat).map((p) => `
        <article class="card dish"><div class="ph">${esc(p.n[0])}</div><div class="in"><span class="b">${esc(p.c)}</span><h2>${esc(p.n)}</h2><p>${esc(p.d)}</p>
        <div class="row"><b style="color:var(--t);font-size:18px">${money(p.p)}</b>${p.on ? '' : '<span class="b red">Agotado</span>'}</div></div></article>`).join('');
    }
    $('#chips').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      mcat = b.dataset.c; $$('#chips button').forEach(x => x.classList.toggle('on', x === b)); renderMenu();
    });

    // El menú se actualiza solo si el administrador cambia platos en otra pestaña
    Store.alCambiar('platos', () => { platos = Store.cargar('platos', []); renderMenu(); });
    renderMenu();
  }
};
