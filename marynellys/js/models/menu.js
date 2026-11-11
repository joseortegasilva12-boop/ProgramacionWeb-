/* ==========================================================
   MODELO: opciones del menú lateral y datos del usuario
   ========================================================== */
const MenuModel = {
  items: [
    { id: 'inventario', texto: 'Inventario', ruta: 'html/inventario.html', panel: 'Panel de Administrador' },
    { id: 'insumo-form', texto: 'Registrar insumo', ruta: 'html/insumo-form.html', panel: 'Panel de Administrador' },
    { id: 'menu-cliente', texto: 'Menú cliente', ruta: 'html/menu-cliente.html', panel: 'Panel de Cliente' },
    { id: 'platos', texto: 'Gestión de platos', ruta: 'html/platos.html', panel: 'Panel de Administrador' },
    { id: 'mesas', texto: 'Mesas', ruta: 'html/mesas.html', panel: 'Panel de Camarero' },
    { id: 'cocina', texto: 'Cocina', ruta: 'html/cocina.html', panel: 'Panel de Cocina' },
    { id: 'caja', texto: 'Caja', ruta: 'html/caja.html', panel: 'Panel de Cajero' },
    { id: 'historial-ventas', texto: 'Historial de ventas', ruta: 'html/historial-ventas.html', panel: 'Panel de Administrador' },
    { id: 'reportes', texto: 'Reportes', ruta: 'html/reportes.html', panel: 'Panel de Administrador' },
    { id: 'usuarios', texto: 'Usuarios y roles', ruta: 'html/usuarios.html', panel: 'Panel de Administrador' }
  ],
  usuario: { nombre: 'María Nelly', rol: 'Administradora' }
};
