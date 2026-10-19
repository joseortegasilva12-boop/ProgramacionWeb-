/* ==========================================================
   VISTA: tabla, totales y resumen del historial de ventas
   ========================================================== */
const VentasView = {
  filas(lista) {
    $('#vb').innerHTML = lista.map((v) => `<tr><td data-l="Fecha">${v.f}</td><td data-l="Mesa">${esc(v.m)}</td><td data-l="Productos">${esc(v.p)}</td><td data-l="Método de pago">${v.mp}</td><td data-l="Total"><b>${money(v.t)}</b></td></tr>`).join('');
    $('#vempty').hidden = lista.length > 0;
    $('#vn').textContent = lista.length;
    $('#vt').textContent = money(VentasModel.total(lista));
  },

  // Dos tarjetas: ventas de hoy y ventas de todo el periodo de uso
  resumen(hoy, periodo) {
    const tarjeta = (titulo, sub, r) => `<div class="card pad sum"><p class="k">${titulo}</p>
      <span class="tot">${money(r.total)}</span>
      <p class="sub" style="margin-bottom:8px">${sub}</p>
      <div class="ln"><span>Ventas realizadas</span><b>${r.n}</b></div>
      <div class="ln"><span>Venta promedio</span><b>${money(r.promedio)}</b></div>
      ${r.metodos.map((m) => `<div class="ln"><span>${m.mp} <small class="sub">(${m.n})</small></span><b>${money(m.total)}</b></div>`).join('')}</div>`;
    $('#resumen').innerHTML =
      tarjeta('HOY', hoy.n ? 'Ventas del día de hoy' : 'Aún no hay ventas hoy', hoy) +
      tarjeta('TODO EL PERIODO', periodo.desde ? 'Desde el ' + periodo.desde : 'Aún no hay ventas registradas', periodo);
  }
};
