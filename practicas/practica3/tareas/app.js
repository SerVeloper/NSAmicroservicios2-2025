import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/tasks', taskRoutes);

// Conexión a MongoDB con reintentos
const connectDB = async () => {
  const maxRetries = 10;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/taskdb');
      console.log('Conectado a MongoDB');
      return;
    } catch (error) {
      console.error(`Intento ${retries + 1} fallido:`, error.message);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (retries === maxRetries) {
        throw new Error('No se pudo conectar a MongoDB después de varios intentos');
      }
    }
  }
};

// Iniciar el servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();