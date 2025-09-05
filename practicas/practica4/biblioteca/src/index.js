require ('reflect-metadata');
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolver = require("./schema/resolver");
const { AppDataSource } = require("./data-source");
const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

async function startServer() {
  const app = express();
  
  // ✅ PRIMERO: Inicializar la base de datos
  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  // ✅ SEGUNDO: Crear Apollo Server con los resolvers
  const server = new ApolloServer({
    typeDefs,
    resolver,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error("❌ Error starting server:", error);
});