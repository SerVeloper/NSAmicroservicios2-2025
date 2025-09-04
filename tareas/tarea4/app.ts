import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger';
import productoRutas from './rutas/productoRutas';
import clienteRutas from './rutas/clienteRutas';
import facturaRutas from './rutas/facturaRutas';
import detalleFacturaRutas from './rutas/detalleFacturaRutas';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

AppDataSource.initialize()
  .then(() => console.log('Base de datos conectada'))
  .catch((error) => console.log('Error en la base de datos:', error));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/productos', productoRutas);
app.use('/clientes', clienteRutas);
app.use('/facturas', facturaRutas);
app.use('/facturas', detalleFacturaRutas);  // Detalles anidados bajo facturas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));