import express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { pool } from './db.js';
import { join } from 'path';
import { swaggerUi, swaggerSpec } from './swagger.js';
import { authMiddleware } from './auth.js';

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Cargar proto
const PROTO_PATH = join(process.cwd(), 'proto', 'vehiculos.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const vehiculosProto = grpc.loadPackageDefinition(packageDefinition).vehiculos;

// Crear cliente gRPC
const client = new vehiculosProto.VehiculosService('localhost:50051', grpc.credentials.createInsecure());

app.post('/envios', async (req, res) => {

  const { id, vehiculo_id, origen, destino, fecha_envio, estado } = req.body;

  // Buscar vehiculo vía gRPC
  client.FindOne({ id: vehiculo_id }, async (err, vehiculo) => {
    if (err) {
      console.error('Error en gRPC:', err);
      return res.status(500).json({ error: 'Error contacting vehiculos service' });
    }

    if (!vehiculo?.id) return res.status(404).json({ error: 'Vehiculo not found' });

    // Insertar envio en PostgreSQL
    const result = await pool.query(
      'INSERT INTO envios (vehiculo_id, origen, destino, fecha_envio, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [vehiculo.id, origen, destino, fecha_envio, estado]
    );

    res.json({
      message: 'Envio created successfully',
      envio: result.rows[0],
      vehiculo,
    });
  });
});


app.get('/envios', async (_, res) => {
  const result = await pool.query('SELECT * FROM envios');
  res.json(result.rows);
});

//eliminar envio
app.delete('/envios/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM envios WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Envio not found' });
  }
  res.json({ message: 'Envio deleted successfully', envio: result.rows[0] });
});

//actualizar envio
app.put('/envios/:id', async (req, res) => {
  const { id } = req.params;
  const { vehiculo_id, origen, destino, fecha_envio, estado } = req.body;
  const result = await pool.query(
    'UPDATE envios SET vehiculo_id = $1, origen = $2, destino = $3, fecha_envio = $4, estado = $5 WHERE id = $6 RETURNING *',
    [vehiculo_id, origen, destino, fecha_envio, estado, id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Envio not found' });
  }
  res.json({ message: 'Envio updated successfully', envio: result.rows[0] });
});

app.listen(3000, async () => {
  // Crear tabla si no existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS envios (
      id SERIAL PRIMARY KEY,
      vehiculo_id INT,
      origen varchar,
      destino varchar,
      fecha_envio timestamp,
      estado bool      
    );
  `);
  console.log('🚀 Orders service running on port 3000');
});
