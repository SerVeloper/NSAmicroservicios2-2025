import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { VehiculosService } from './vehiculos.service';

@Controller()
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @GrpcMethod('VehiculosService', 'FindOne')
  async findOne({ id }: { id: number }) {
    return this.vehiculosService.findOne(id);
  }

  @GrpcMethod('VehiculosService', 'CreateVehiculo')
  async createVehiculo(data: { placa: string; tipo: string; capacidad: number; estado: boolean }) {
    return this.vehiculosService.create(data);
  }

  @GrpcMethod('VehiculosService', 'FindAll')
  async findAll() {
    const vehiculos = await this.vehiculosService.findAll();
    return { vehiculos }; // ✅ se ajusta al message VehiculosListResponse
  }

  @GrpcMethod('VehiculosService', 'UpdateVehiculo')
  async updateVehiculo({
    id,
    ...data
  }: {
    id: number;
    placa?: string;
    tipo?: string;
    capacidad?: number;
    estado?: boolean;
  }) {
    return this.vehiculosService.update(id, data);
  }

  @GrpcMethod('VehiculosService', 'RemoveVehiculo')
  async removeVehiculo({ id }: { id: number }) {
    return this.vehiculosService.remove(id);
  }
}
