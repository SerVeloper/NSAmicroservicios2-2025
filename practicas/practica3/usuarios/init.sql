CREATE DATABASE IF NOT EXISTS usuarios_db;
USE usuarios_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO usuarios (nombre, correo) VALUES
  ('Juan Pérez', 'juan@example.com'),
  ('María López', 'maria@example.com');

-- Permitir conexiones remotas para root
GRANT ALL PRIVILEGES ON usuarios_db.* TO 'root'@'%' IDENTIFIED BY 'rootpass';
FLUSH PRIVILEGES;