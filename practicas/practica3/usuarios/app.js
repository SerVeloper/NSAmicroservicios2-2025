import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); // Ajustado a src/views

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Función para conectar a MySQL con reintentos
async function connectWithRetry() {
  const maxRetries = 10;
  const retryInterval = 5000; // 5 segundos
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'mysql_db',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'rootpass',
        database: process.env.MYSQL_DATABASE || 'usuarios_db',
      });
      console.log('Conectado a MySQL');
      return connection;
    } catch (error) {
      console.error(`Intento ${retries + 1} fallido:`, error.message);
      retries++;
      if (retries === maxRetries) {
        throw new Error('No se pudo conectar a MySQL después de varios intentos');
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
}

// Función principal para iniciar la aplicación
async function startApp() {
  let db;
  try {
    db = await connectWithRetry();

    // Ruta principal: listar usuarios
    app.get('/', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT * FROM usuarios');
        console.log('Datos de usuarios:', rows); // Para depurar
        res.render('index', { usuarios: rows });
      } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).send('Error al obtener usuarios: ' + error.message);
      }
    });

    // Mostrar formulario
    app.get('/nuevo', (req, res) => {
      res.render('form');
    });

    // Agregar usuario
    app.post('/nuevo', async (req, res) => {
      const { nombre, correo } = req.body;
      try {
        await db.execute(
          'INSERT INTO usuarios (nombre, correo, created_at) VALUES (?, ?, NOW())',
          [nombre, correo]
        );
        res.redirect('/');
      } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).send('Error al registrar usuario: ' + error.message);
      }
    });

    // Eliminar usuario
    app.post('/eliminar/:id', async (req, res) => {
      const { id } = req.params;
      try {
        await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        res.redirect('/');
      } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).send('Error al eliminar usuario: ' + error.message);
      }
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

startApp();