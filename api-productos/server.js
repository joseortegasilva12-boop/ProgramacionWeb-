// server.js
import express from "express";

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 },
];
let siguienteId = 3;

// 1. GET /productos (lista todos; con max= filtra por precio, que es el reto)
app.get("/productos", (req, res) => {
  const { max } = req.query;
  if (max !== undefined) {
    const filtrados = productos.filter((p) => p.precio <= Number(max));
    return res.status(200).json(filtrados);
  }
  res.status(200).json(productos);
});

// 2. GET /productos/:id (devuelve uno)
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No existe" });
  res.status(200).json(producto);
});

// 3. POST /productos (crea uno nuevo)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock = 0 } = req.body;

  if (!nombre || precio === undefined || precio < 0 || stock < 0) {
    return res.status(400).json({ error: "Faltan datos o no son válidos" });
  }

  const nuevo = { id: siguienteId++, nombre, precio, stock };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// 4. PUT /productos/:id (reemplaza TODOS los campos)
app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({ error: "No existe" });

  const { nombre, precio, stock } = req.body;
  if (
    !nombre ||
    precio === undefined ||
    stock === undefined ||
    precio < 0 ||
    stock < 0
  ) {
    return res.status(400).json({ error: "PUT exige todos los campos válidos" });
  }

  productos[i] = { id, nombre, precio, stock };
  res.status(200).json(productos[i]);
});

// 5. PATCH /productos/:id (cambia solo algunos campos)
app.patch("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.status(404).json({ error: "No existe" });

  const { nombre, precio, stock } = req.body;

  if (nombre !== undefined && !nombre) {
    return res.status(400).json({ error: "Nombre no válido" });
  }
  if (precio !== undefined && precio < 0) {
    return res.status(400).json({ error: "Precio no válido" });
  }
  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ error: "Stock no válido" });
  }

  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;

  res.status(200).json(producto);
});

// 6. DELETE /productos/:id (borra el producto)
app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) return res.status(404).json({ error: "No existe" });

  productos.splice(i, 1);
  res.status(204).end();
});


app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));