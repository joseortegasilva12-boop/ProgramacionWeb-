/* ==========================================================
   CONTROLADOR: reportes del día
   ========================================================== */
// (por ahora el dibujo y los eventos de esta página están juntos; falta separarlos en vista y controlador)
const ReportesController = {
  init() {
    function render() {
      const r = ReportesModel.resumenDia(), top = ReportesModel.masVendidos(ReportesModel.ventasHoy()), bajos = ReportesModel.porAgotarse();
      $('#r-total').textContent = money(r.total);
      $('#r-total-s').textContent = r.n ? `${r.n} venta${r.n === 1 ? '' : 's'} hoy` : 'Sin datos';
      $('#r-n').textContent = r.n;
      $('#r-n-s').textContent = 'Promedio ' + money(r.promedio);
      $('#r-m').textContent = r.mesas;
      $('#r-m-s').textContent = r.mesas ? 'Mesas distintas cobradas hoy' : 'Sin datos';
      $('#r-top').innerHTML = top.length
        ? top.map((t, i) => `<div class="ln"><span>${i + 1}. ${esc(t.n)}</span><b>${t.q} vendido${t.q === 1 ? '' : 's'}</b></div>`).join('')
        : '<p class="sub">Sin ventas hoy todavía.</p>';
      $('#r-low').innerHTML = bajos.length
        ? bajos.map((x) => `<div class="ln"><span>${esc(x.n)}</span><span class="b red">${x.q} ${esc(x.u)} · mín. ${x.m}</span></div>`).join('')
        : '<p class="sub">Ningún insumo por debajo del mínimo.</p>';
    }
    Store.alCambiar('ventas', () => { VentasModel.recargar(); render(); });
    Store.alCambiar('ins', () => { ins = Store.cargar('ins', []); render(); });
    render();
  }
};
