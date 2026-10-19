/* ==========================================================
   VISTA: tabla del inventario
   ========================================================== */
const InventarioView = {
  filas(lista) {
    $('#tb').innerHTML = lista.map(({ r, i }) => `<tr>
      <td data-l="Insumo"><b>${r.n}</b> ${InsumosModel.esBajo(r) ? '<span class="b red">Stock bajo</span>' : ''}</td>
      <td data-l="Categoría">${r.c}</td><td data-l="Cantidad">${r.q} ${r.u}</td><td data-l="Stock mínimo">${r.m} ${r.u}</td>
      <td data-l="Costo unitario">${money(r.p)}</td><td data-l="Proveedor">${r.v || '—'}</td>
      <td class="act"><button data-e="${i}" aria-label="Editar ${r.n}">Editar</button><button class="del" data-d="${i}" aria-label="Eliminar ${r.n}">Eliminar</button></td></tr>`).join('');
    $('#empty').hidden = lista.length > 0;
  }
};
