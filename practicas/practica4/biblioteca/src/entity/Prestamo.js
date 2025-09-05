const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamo",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    fecha_prestamo: {
      type: Date,
    },
    fecha_devolucion: {
      type: Date,
      nullable: true,
    },
  },
  relations: {
    libro: {
      type: "many-to-one",
      target: "Libro",
      joinColumn: true,
      eager: true,
    },
  },
});