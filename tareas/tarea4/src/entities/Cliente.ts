import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ci: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    sexo: string;

} 