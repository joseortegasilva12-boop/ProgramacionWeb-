/* ==========================================================
   VISTA: barra lateral y barra superior (se dibujan desde MenuModel)
   ========================================================== */
const ShellView = {
  render(pagina, raiz) {
    const actual = MenuModel.items.find((i) => i.id === pagina);
    $('#side').innerHTML = `
      <div class="logo"><i>MN</i><div><b>MaryNellys</b><small>Sabor de familia</small></div></div>
      ${MenuModel.items.map((i) => `<a class="nav${i.id === pagina ? ' on' : ''}" href="${raiz}${i.ruta}">${i.texto}</a>`).join('')}`;
    $('#topbar').innerHTML = `
      <button class="btn sec" id="burger" aria-label="Abrir menú">☰</button>
      <b>${actual ? actual.panel : ''}</b><span class="b ok">Restaurante abierto</span>
      <span class="who">${MenuModel.usuario.nombre} · ${MenuModel.usuario.rol}</span>`;
  }
};
