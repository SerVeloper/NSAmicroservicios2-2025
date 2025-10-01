const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { AppDataSource } = require('./src/config/database');

const medicosRouter = require('./src/routes/medicos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Inicializar TypeORM
AppDataSource.initialize()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch((err) => console.error('Error al conectar la base de datos:', err));

// Rutas
app.use('/api/medicos', medicosRouter);

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'API de Médicos con TypeORM funcionando' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});