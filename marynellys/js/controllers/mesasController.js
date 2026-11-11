/* ==========================================================
   CONTROLADOR: mesas, pedido del camarero y envío a cocina
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const MesasController = {
  init() {
    let sel = mesas.length ? mesas[0].n : null;
    let cat = '';       // categoría que se está mirando al tomar el pedido ('' = todas)
    const notas = {};   // nota para cocina de cada mesa, para que no se pierda al redibujar
    const bc = { Libre: 'ok', Ocupada: 'am', 'Por cobrar': 'bl' };

    function renderPedido(m) {
      if (!m) return '<p class="sub">Aún no hay mesas registradas. Usa «+ Nueva mesa».</p>';
      if (m.s === 'Libre') return `<h2>Mesa ${m.n}</h2><p class="sub" style="margin:8px 0 16px">Mesa libre. Ábrela para tomar el pedido.</p><button class="btn" id="open">Abrir mesa</button> <button class="btn sec" id="del" style="color:var(--er)">Eliminar mesa</button>`;

      const abierta = m.s === 'Ocupada';
      const disponibles = platos.map((p, i) => ({ p, i })).filter(({ p }) => p.on && (!cat || p.c === cat));
      const hayPlatos = platos.some((p) => p.on);
      const catNombre = { '': 'Todo', Entrada: 'Entradas', 'Plato fuerte': 'Platos fuertes', Bebida: 'Bebidas' };
      const selector = `<div class="chips" style="margin:12px 0 8px">${Object.keys(catNombre).map((k) => `<button class="${k === cat ? 'on' : ''}" data-cat="${k}">${catNombre[k]}</button>`).join('')}</div>
        <div style="max-height:220px;overflow:auto;margin-bottom:8px">${disponibles.length
          ? disponibles.map(({ p, i }) => `<div class="ln"><span>${esc(p.n)} <small class="sub">· ${money(p.p)}</small></span><button class="btn qty" data-p="${i}" aria-label="Agregar ${esc(p.n)}">+ Agregar</button></div>`).join('')
          : `<p class="sub">${hayPlatos ? 'No hay productos disponibles en esta categoría.' : 'No hay platos disponibles. Agrégalos en «Gestión de platos».'}</p>`}</div>`;
      const pend = MesasModel.pendientes(m).length;
      const items = m.items.map((i, idx) => `<div class="ln"><span>${i.q}× ${esc(i.n)}${i.e ? ` <small class="sub">(${i.e} en cocina)</small>` : ''}</span>
        <span>${abierta ? `<button class="btn sec qty" data-menos="${idx}" aria-label="Quitar uno" ${i.q <= i.e ? 'disabled' : ''}>−</button> <button class="btn sec qty" data-mas="${idx}" aria-label="Agregar uno">+</button> ` : ''}<b>${money(i.q * i.p)}</b></span></div>`).join('');

      return `<h2>Pedido · Mesa ${m.n} <span class="b ${bc[m.s]}">${m.s}</span></h2>
        ${abierta ? selector : '<p class="sub" style="margin:8px 0">Cuenta pedida: esperando el cobro en caja.</p>'}
        <h2 style="font-size:15px;margin-top:8px">Pedido actual</h2>
        ${items || '<p class="sub">Aún no hay nada en este pedido. Toca «+ Agregar» en un producto.</p>'}
        ${abierta ? `<div class="fl" style="margin-top:12px"><label for="nota">Notas para cocina</label><textarea id="nota" placeholder="Ej. Sin cebolla, término medio…">${esc(notas[m.n] || '')}</textarea></div>` : ''}
        <div class="ln"><span>Total</span><span class="tot">${money(MesasModel.subtotal(m))}</span></div>
        ${abierta ? `<button class="btn" id="send" style="width:100%;margin-top:12px" ${pend ? '' : 'disabled'}>Enviar a cocina${pend ? ` (${pend})` : ''}</button>
        <button class="btn sec" id="bill" style="width:100%;margin-top:8px" ${m.items.length ? '' : 'disabled'}>Pedir cuenta</button>
        ${m.items.length ? '' : '<button class="btn sec" id="close" style="width:100%;margin-top:8px">Cerrar mesa (sin pedido)</button>'}` : ''}`;
    }

    function renderMesas() {
      $('#mm').innerHTML = mesas.map(m => `<div class="mesa ${m.s.split(' ')[0]} ${m.n === sel ? 'sel' : ''}" data-n="${m.n}" tabindex="0"><h2>Mesa ${m.n}</h2><small class="sub">${m.p} puestos</small><br><span class="b ${bc[m.s]}">${m.s}</span></div>`).join('');
      $('#ped').innerHTML = renderPedido(MesasModel.buscar(sel));
    }

    $('#nm').addEventListener('click', async () => {
      const datos = await ModalView.formulario({ titulo: 'Nueva mesa', campos: MesasModel.campos(), textoSi: 'Agregar mesa' });
      if (!datos) return;
      MesasModel.agregar(datos); sel = datos.n; renderMesas(); toast('Mesa agregada');
    });

    $('#mm').addEventListener('click', e => { const c = e.target.closest('.mesa'); if (c) { sel = +c.dataset.n; renderMesas(); } });
    $('#mm').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.click(); });

    $('#ped').addEventListener('input', e => { if (e.target.id === 'nota') notas[sel] = e.target.value; });
    $('#ped').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.id === 'del') {
        return ask('¿Eliminar esta mesa?', `Vas a eliminar la mesa ${sel} del salón.`, () => { MesasModel.eliminar(sel); sel = mesas.length ? mesas[0].n : null; renderMesas(); toast('Mesa eliminada'); });
      }
      if (b.id === 'close') { MesasModel.liberar(sel); toast('Mesa cerrada'); }
      else if (b.id === 'open') { MesasModel.abrir(sel); toast('Mesa abierta'); }
      else if (b.dataset.cat !== undefined) { cat = b.dataset.cat; }
      else if (b.dataset.p !== undefined) { MesasModel.agregarItem(sel, platos[+b.dataset.p]); }
      else if (b.dataset.mas !== undefined) { const it = MesasModel.buscar(sel).items[+b.dataset.mas]; MesasModel.agregarItem(sel, { n: it.n, p: it.p }); }
      else if (b.dataset.menos !== undefined) { MesasModel.quitarItem(sel, +b.dataset.menos); }
      else if (b.id === 'send') {
        const ok = MesasModel.enviarACocina(sel, (notas[sel] || '').trim());
        if (ok) { notas[sel] = ''; toast('Pedido enviado a cocina'); }
      }
      else if (b.id === 'bill') { MesasModel.pedirCuenta(sel); toast('Cuenta enviada a caja'); }
      renderMesas();
    });

    // Si caja cobra una mesa (otra pestaña), aquí se actualiza sola
    Store.alCambiar('mesas', () => { MesasModel.recargar(); renderMesas(); });
    Store.alCambiar('platos', () => { PlatosModel.recargar(); renderMesas(); });
    renderMesas();
  }
};
