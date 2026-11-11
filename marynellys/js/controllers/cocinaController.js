/* ==========================================================
   CONTROLADOR: comandas de cocina (Pendiente → Preparando → Listo)
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const CocinaController = {
  init() {
    const cols = ComandasModel.estados, bt = ['Empezar preparación', 'Marcar como listo', 'Pedido entregado'], cl = ['red', 'am', 'ok'];
    const hace = (x) => { const m = ComandasModel.minutos(x); return m < 1 ? 'Ahora' : `Hace ${m} min`; };

    function renderCocina() {
      $('#kb').innerHTML = cols.map((c, s) => {
        const cs = com.filter(x => x.s === s).sort((a, b) => a.ts - b.ts);
        return `<div class="col"><h2><span class="b ${cl[s]}">${c} · ${cs.length}</span></h2>
        ${s === 2 && cs.length ? '<button class="btn sec" data-limpiar>🗑 Limpiar listos</button>' : ''}
        ${cs.map(x => `
        <div class="card"><div class="ln"><b>${esc(x.m)} · #${x.id}</b><span class="b ${cl[s]}">${hace(x)}</span></div>
        ${(x.items || []).map(i => `<div class="ln"><span>${esc(i)}</span></div>`).join('')}
        ${x.nota ? `<p class="sub" style="font-size:13px;margin-top:6px">Nota: ${esc(x.nota)}</p>` : ''}<button class="btn" style="width:100%;margin-top:8px" data-id="${x.id}">${bt[s]}</button></div>`).join('')}</div>`;
      }).join('');
    }

    $('#kb').addEventListener('click', e => {
      if (e.target.closest('[data-limpiar]')) {
        const n = com.filter(x => x.s === 2).length;
        return ask('¿Limpiar pedidos listos?', `Vas a quitar ${n} pedido${n === 1 ? '' : 's'} de la columna Listo.`, () => { ComandasModel.limpiarListos(); renderCocina(); toast('Pedidos listos borrados'); });
      }
      const b = e.target.closest('[data-id]'); if (!b) return;
      ComandasModel.avanzar(+b.dataset.id); renderCocina();
    });

    // Llegan comandas nuevas desde la pantalla del camarero sin recargar
    Store.alCambiar('com', () => { ComandasModel.recargar(); renderCocina(); });
    setInterval(renderCocina, 30000);   // refresca los "hace X min"
    renderCocina();
  }
};
