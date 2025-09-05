import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cliente } from "./Cliente";

//Entidad Factura
@Entity()
export class Factura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column()
    total: number;

    @Column()
    clienteId: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.id, { onDelete: 'CASCADE' })
    cliente!: Cliente;
}
