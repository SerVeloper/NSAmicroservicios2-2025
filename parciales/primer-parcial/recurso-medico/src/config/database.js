const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: "serdev",
  password: "nifer2030",
  database: "recurso_medico_db",
  entities: ['src/entities/*.js'],
  synchronize: true, // Solo para desarrollo
});

module.exports = { AppDataSource };