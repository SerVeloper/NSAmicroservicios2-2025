import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column("numeric", { precision: 10, scale: 2 })
    precio: number;

    @Column()
    descripcion: string;

    @Column()
    marca: string;

    @Column()
    stok: number;
}