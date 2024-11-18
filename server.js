const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // Cambiar si tienes otro usuario
  password: "Agujeronegro2000",       // Si tienes una contraseña, ponla aquí
  database: "billeteradigital" // Asegúrate de que la base de datos existe
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos");
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando en http://localhost:3001");
});

// Rutas para Clientes
app.post("/clientes", (req, res) => {
  const { nombre, email, saldo } = req.body;
  const query = "INSERT INTO Clientes (nombre, email, saldo) VALUES (?, ?, ?)";
  db.query(query, [nombre, email, saldo], (err, result) => {
    if (err) {
      console.error("Error al crear el cliente:", err);
      res.status(500).send("Error al crear el cliente.");
    } else {
      res.status(201).send("Cliente creado exitosamente.");
    }
  });
});

app.get("/clientes", (req, res) => {
  const query = "SELECT * FROM Clientes";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      res.status(500).send("Error al obtener los clientes.");
    } else {
      res.json(results);
    }
  });
});

app.get("/clientes/:id", (req, res) => {
  const clienteId = req.params.id;
  const query = "SELECT * FROM Clientes WHERE id = ?";
  db.query(query, [clienteId], (err, result) => {
    if (err) {
      console.error("Error al obtener el cliente:", err);
      res.status(500).send("Error al obtener el cliente.");
    } else {
      res.json(result);
    }
  });
});

app.put("/clientes/:id", (req, res) => {
  const clienteId = req.params.id;
  const { nombre, email, saldo } = req.body;
  const query = "UPDATE Clientes SET nombre = ?, email = ?, saldo = ? WHERE id = ?";
  db.query(query, [nombre, email, saldo, clienteId], (err, result) => {
    if (err) {
      console.error("Error al actualizar el cliente:", err);
      res.status(500).send("Error al actualizar el cliente.");
    } else {
      res.send("Cliente actualizado exitosamente.");
    }
  });
});

app.delete("/clientes/:id", (req, res) => {
  const clienteId = req.params.id;
  const query = "DELETE FROM Clientes WHERE id = ?";
  db.query(query, [clienteId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el cliente:", err);
      res.status(500).send("Error al eliminar el cliente.");
    } else {
      res.send("Cliente eliminado exitosamente.");
    }
  });
});

// Rutas para Transacciones (Consignación y Retiro)
app.post("/transacciones", (req, res) => {
  const { cliente_id, tipo, monto } = req.body;
  const query = "INSERT INTO Transacciones (cliente_id, tipo, monto) VALUES (?, ?, ?)";

  db.query(query, [cliente_id, tipo, monto], (err, result) => {
    if (err) {
      console.error("Error al crear la transacción:", err);
      res.status(500).send("Error al crear la transacción.");
    } else {
      const updateQuery = tipo === 'consignacion' ? 
        "UPDATE Clientes SET saldo = saldo + ? WHERE id = ?" : 
        "UPDATE Clientes SET saldo = saldo - ? WHERE id = ?";
                
      db.query(updateQuery, [monto, cliente_id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error al actualizar el saldo:", updateErr);
          res.status(500).send("Error al actualizar el saldo.");
        } else {
          res.send("Transacción realizada exitosamente.");
        }
      });
    }
  });
});

app.get("/transacciones/:cliente_id", (req, res) => {
  const clienteId = req.params.cliente_id;
  const query = "SELECT * FROM Transacciones WHERE cliente_id = ?";
  
  db.query(query, [clienteId], (err, results) => {
    if (err) {
      console.error("Error al obtener las transacciones:", err);
      res.status(500).send("Error al obtener las transacciones.");
    } else {
      res.json(results);
    }
  });
});

// Rutas para Servicios (Pago de Servicios Públicos, Compra de Paquetes)
app.post("/servicios", (req, res) => {
  const { cliente_id, descripcion, monto } = req.body;
  const query = "INSERT INTO Servicios (cliente_id, descripcion, monto) VALUES (?, ?, ?)";

  db.query(query, [cliente_id, descripcion, monto], (err, result) => {
    if (err) {
      console.error("Error al crear el servicio:", err);
      res.status(500).send("Error al crear el servicio.");
    } else {
      res.send("Servicio realizado exitosamente.");
    }
  });
});

app.get("/servicios/:cliente_id", (req, res) => {
  const clienteId = req.params.cliente_id;
  const query = "SELECT * FROM Servicios WHERE cliente_id = ?";
  
  db.query(query, [clienteId], (err, results) => {
    if (err) {
      console.error("Error al obtener los servicios:", err);
      res.status(500).send("Error al obtener los servicios.");
    } else {
      res.json(results);
    }
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
