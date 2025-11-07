// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orders Microservice API",
      version: "1.0.0",
      description: "API documentation for Orders service (Express + gRPC)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./index.js"], // 👈 archivos donde leerá los comentarios JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
