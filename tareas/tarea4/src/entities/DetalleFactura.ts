import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Factura } from "./Factura";
import { Producto } from "./Producto";

@Entity()
export class DetalleFactura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    facturaId: number;

    @Column()
    productoId: number;

    @Column()
    cantidad: number;

    @Column("numeric", { precision: 10, scale: 2 })
    precioUnitario: number;

    @Column("numeric", { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => Factura, factura => factura.id, { onDelete: 'CASCADE' })
    factura!: Factura;

    @ManyToOne(() => Producto, producto => producto.id)
    producto!: Producto;
}