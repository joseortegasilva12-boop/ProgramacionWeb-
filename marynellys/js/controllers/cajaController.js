/* ==========================================================
   CONTROLADOR: cobro en caja
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const CajaController = {
  init() {
    let sel = null, metodo = 'Efectivo';
    const bc = { Ocupada: 'am', 'Por cobrar': 'bl' };
    const mesaSel = () => MesasModel.buscar(sel);
    const conServicio = () => $('#sv').checked;

    // Mesas que tienen una cuenta para cobrar
    function renderMesas() {
      const lista = MesasModel.porCobrar();
      if (sel !== null && !lista.some(m => m.n === sel)) sel = null;   // esa mesa ya se cobró
      $('#cm').innerHTML = lista.length ? lista.map(m => `<div class="mesa ${m.s.split(' ')[0]} ${m.n === sel ? 'sel' : ''}" data-n="${m.n}" tabindex="0">
          <h2>Mesa ${m.n}</h2><span class="b ${bc[m.s]}">${m.s}</span><br><b>${money(MesasModel.subtotal(m))}</b></div>`).join('')
        : '<p class="sub" style="grid-column:1/-1">No hay mesas con cuenta por cobrar.</p>';
      renderCuenta();
    }

    // Cuenta de la mesa seleccionada
    function renderCuenta() {
      const m = mesaSel();
      $('#cuenta').innerHTML = !m ? '<p class="sub">Selecciona una mesa para ver su cuenta.</p>'
        : `<h2>Mesa ${m.n} <span class="b ${bc[m.s]}">${m.s}</span></h2>` + m.items.map(i => `<div class="ln"><span>${i.q}× ${esc(i.n)}</span><b>${money(i.q * i.p)}</b></div>`).join('');
      $('#sb').textContent = money(m ? MesasModel.subtotal(m) : 0);
      $('#sva').textContent = money(m ? MesasModel.servicio(m, conServicio()) : 0);
      $('#tt').textContent = money(m ? MesasModel.total(m, conServicio()) : 0);
      renderCambio();
    }

    function renderCambio() {
      const m = mesaSel(), total = m ? MesasModel.total(m, conServicio()) : 0, v = +$('#rc').value;
      $('#cb').textContent = v > total ? money(v - total) : '$0';
    }

    $('#cm').addEventListener('click', e => { const c = e.target.closest('.mesa'); if (c) { sel = +c.dataset.n; renderMesas(); } });
    $('#cm').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.click(); });
    $('#sv').addEventListener('change', renderCuenta);

    $('#pays').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      metodo = b.dataset.m; $$('#pays button').forEach(x => x.classList.toggle('on', x === b)); $('#rce').textContent = ''; $('#rc').classList.remove('bad');
    });
    $('#rc').addEventListener('input', () => { renderCambio(); $('#rce').textContent = ''; $('#rc').classList.remove('bad'); });

    $('#pay').addEventListener('click', () => {
      const m = mesaSel(), v = $('#rc').value; let msg = '';
      if (!m) msg = 'Primero selecciona la mesa que vas a cobrar';
      else if (metodo === 'Efectivo') msg = v === '' ? 'Ingresa el valor recibido' : +v < MesasModel.total(m, conServicio()) ? 'El valor recibido es menor al total a pagar' : '';
      $('#rce').textContent = msg; $('#rc').classList.toggle('bad', !!msg);
      if (msg) return;

      const cambio = metodo === 'Efectivo' ? +v - MesasModel.total(m, conServicio()) : 0;
      const total = MesasModel.cobrar(m.n, metodo, conServicio());
      if (total === null) { toast('Esa mesa ya no tiene cuenta'); MesasModel.recargar(); return renderMesas(); }
      $('#rc').value = '';
      toast(`Mesa ${m.n} cobrada: ${money(total)} con ${metodo.toLowerCase()}${cambio ? ' · cambio ' + money(cambio) : ''}`);
      sel = null; renderMesas();
    });

    // Si el camarero pide una cuenta (otra pestaña), aparece sola
    Store.alCambiar('mesas', () => { MesasModel.recargar(); renderMesas(); });
    renderMesas();
  }
};
