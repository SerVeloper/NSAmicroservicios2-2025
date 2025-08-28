const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Servir la vista
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Ruta para calcular
app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  let resultado;

  switch (operacion) {
    case "sumar":
      resultado = numA + numB;
      break;
    case "restar":
      resultado = numA - numB;
      break;
    case "multiplicar":
      resultado = numA * numB;
      break;
    case "dividir":
      resultado = numB !== 0 ? numA / numB : "Error: división por cero";
      break;
    default:
      resultado = "Operación no válida";
  }

  res.send(`
    <h1>Resultado: ${resultado}</h1>
    <a href="/">Volver</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

