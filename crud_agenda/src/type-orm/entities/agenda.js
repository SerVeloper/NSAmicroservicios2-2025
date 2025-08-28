const { PrimaryGeneratedColumn, Column, Entity } = require("typeorm");

class Agenda {
    @PrimaryGeneratedColumn()
    id;
    
    @Column({type: 'varchar', length: 100})
    nombres;
    
    @Column({type: 'varchar', length: 100})
    apellidos;
    
    @Column({type: 'date'})
    fecha_nacimiento;

    @Column({type: 'varchar', length: 200})
    direccion;

    @Column({type: 'varchar', length: 15})
    celular;

    @Column({type: 'varchar', length: 100})
    correo;
}

module.exports = Agenda;

