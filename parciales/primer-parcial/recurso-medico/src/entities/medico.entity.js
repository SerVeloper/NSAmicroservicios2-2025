const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Medico',
  tableName: 'medicos',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true, // Equivalente a SERIAL
    },
    nombre: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    apellido: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    cedula_profesional: {
      type: 'varchar',
      length: 50,
      unique: true,
      nullable: false,
    },
    especialidad: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    anos_experiencia: {
      type: 'integer',
      nullable: false,
    },
    correo_electronico: {
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false,
    },
  },
});