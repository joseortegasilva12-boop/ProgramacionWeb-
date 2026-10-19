# MaryNellys – Entrega 2 (HTML, CSS y JavaScript)
Estructura MVC sin frameworks:
- `index.html`, `html/` → **Vistas** (una página por cada pantalla)
- `css/` → estilos (`base`, `layout`, `responsive`)
- `js/models/` → datos y reglas (validación, búsquedas, totales)
- `js/views/` → manipulación del DOM (dibujar tablas, errores, modales, menú)
- `js/controllers/` → eventos con `addEventListener`
- `js/main.js` → punto de entrada
Los datos de ejemplo van en `js/models/datos.js`. Abrir con un servidor (Live Server o GitHub Pages).

## Entrega 3 – funciones agregadas
- **Datos guardados en el navegador** (`localStorage`, clase `Store` en `js/models/datos.js`): lo que se agrega en una pantalla se ve en las demás. Para empezar de cero: borrar los datos del sitio en el navegador.
- **Gestión de platos**: nuevo, editar, disponible hoy y eliminar → se refleja en *Menú cliente* y en el pedido del camarero.
- **Mesas**: nueva mesa, abrir, agregar platos al pedido, enviar a cocina, pedir cuenta.
- **Cocina**: Pendiente → Preparando → Listo → Entregado, y botón *Limpiar listos*.
- **Caja**: lista de mesas por cobrar, cuenta detallada, servicio 10% opcional, pago y cambio. Al cobrar registra la venta y libera la mesa.
- **Historial de ventas**: resumen de *hoy* y de *todo el periodo* (total, cantidad, promedio y por método de pago).
- **Usuarios y roles**: crear, editar, activar/desactivar y eliminar.
- Modelos nuevos: `platos.js`, `mesas.js`, `comandas.js`, `usuarios.js`. Formulario en ventana reutilizable: `ModalView.formulario`.
- **Insumos**: registrar y editar ahora guardan de verdad y se ven en el inventario.
- **Reportes**: se calculan con los datos reales (ventas del día, pedidos, mesas atendidas, platos más vendidos e insumos bajo el mínimo).
- **Mesas**: también se pueden cerrar (si no tienen pedido) y eliminar (si están libres).
- **Menú cliente**: es solo de consulta (sin botón Pedir); los platos agotados muestran la etiqueta «Agotado».
- **Pedido de mesa**: se elige por categoría (Todo, Entradas, Platos fuertes, Bebidas) y se agrega con un toque; los productos salen de *Gestión de platos*, así que una bebida debe estar creada ahí con categoría «Bebida» y marcada como disponible.
