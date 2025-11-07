# ---------- Etapa 1: build ----------
FROM node:20 AS builder

WORKDIR /app

# Copiar package.json desde la carpeta users-ms
COPY users-ms/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente del microservicio
COPY users-ms/ ./

# Compilar el proyecto NestJS
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM node:20

WORKDIR /app

# Copiar package.json y solo dependencias necesarias
COPY users-ms/package*.json ./
RUN npm install --omit=dev

# Copiar el build de la etapa anterior
COPY --from=builder /app/dist ./dist

# Copiar archivos necesarios (.proto incluido)
COPY proto ./proto

# Exponer puertos gRPC y HTTP
EXPOSE 50051 3001

# Comando de inicio
CMD ["node", "dist/main.js"]
