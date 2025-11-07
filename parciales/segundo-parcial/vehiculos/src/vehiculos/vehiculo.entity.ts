import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  placa: string;

  @Column()
  tipo: string;

  @Column()
  capacidad: number;

  @Column()
  estado: boolean;
}
