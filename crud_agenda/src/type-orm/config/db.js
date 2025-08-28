const DataSource = require("typeorm");
const Agenda = require("../entities/agenda");
require('dotenv').config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Agenda],
    migrations: [],
    subscribers: [],
})

async function connectDB() {
    try {
        await AppDataSource.initialize();
        console.log("Conexión a la base de datos establecida");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}

module.exports = { AppDataSource, connectDB };