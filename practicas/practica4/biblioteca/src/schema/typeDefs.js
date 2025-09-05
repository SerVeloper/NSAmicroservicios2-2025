const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Libro {
    id: ID!
    titulo: String!
    autor: String!
    anio_publicacion: Int!
    prestamos: [Prestamo!]
  }

  type Prestamo {
    id: ID!
    usuario: String!
    fecha_prestamo: String!
    fecha_devolucion: String
    libro: Libro!
  }

  type Query {
    getLibros: [Libro!]
    getPrestamos: [Prestamo!]
    getLibroById(id: ID!): Libro
    getPrestamoByUser(usuario: String!): [Prestamo!]
  }

  type Mutation {
    createLibro(titulo: String!, autor: String!, anio_publicacion: Int!): Libro
    createPrestamo(usuario: String!, libroId: ID!): Prestamo
  }

  query GetAllPrestamos {
    getPrestamos {
      id
      usuario
      fecha_prestamo
      fecha_devolucion
      libro {
        id
        titulo
        autor
        isbn
        anio_publicacion
      }
    }
  }

  query GetAllLibros {
    getLibros {
      id
      titulo
      autor
      isbn
      anio_publicacion
      prestamos {
        id
        usuario
        fecha_prestamo
        fecha_devolucion
      }
    }
  }

  query GetPrestamosByUsuario($usuario: String!) {
    getPrestamoByUser(usuario: $usuario) {
      id
      usuario
      fecha_prestamo
      fecha_devolucion
      libro {
        id
        titulo
      }
    }
  }

  mutation CreateLibro {
    createLibro(
      titulo: "1984"
      autor: "George Orwell"
      isbn: "9780307474728"
      anio_publicacion: 1949
    ) {
      id
      titulo
      autor
      isbn
      anio_publicacion
    }
  }

  mutation CreatePrestamo{
    createPrestamo(
      usuario: "María López"
      libroId: 1
      fecha_prestamo: "2025-09-04"
      fecha_devolucion: "2025-09-20"
    ) {
      id
      usuario
      fecha_prestamo
      fecha_devolucion
      libro {
        id
        titulo
      }
    }
  }
`;
module.exports = typeDefs;
