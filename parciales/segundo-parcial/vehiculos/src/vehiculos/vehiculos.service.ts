import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';

@Injectable()
export class VehiculosService {
  constructor(@InjectRepository(Vehiculo) private repo: Repository<Vehiculo>) {}

  async findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Vehiculo>) {
    const vehiculo = this.repo.create(data);
    return this.repo.save(vehiculo);
  }

  async findAll() {
    return this.repo.find();
  }

  async update(id: number, data: Partial<Vehiculo>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const vehiculo = await this.findOne(id);
    if (vehiculo) {
      await this.repo.remove(vehiculo);
    }
    return vehiculo;
  }
}
