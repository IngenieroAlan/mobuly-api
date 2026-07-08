import { randomUUID } from 'node:crypto';
import { Service } from '../../domain/entities/Service.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { CreateServiceDTO } from '../dto/ServiceDTO.js';
import { ServiceResponseDTO } from '../dto/ServiceResponseDTO.js';
import { Price } from '../../domain/valueObjects/Price.js';

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(
    userId: string,
    dto: CreateServiceDTO,
  ): Promise<ServiceResponseDTO> {
    const service = Service.create({
      id: randomUUID(),
      userId,
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      precio: Price.create(dto.precio),
      duracionMinutos: dto.duracionMinutos,
    });

    const created = await this.serviceRepository.create(service);

    return this.toResponse(created);
  }

  private toResponse(service: Service): ServiceResponseDTO {
    return {
      id: service.id,
      userId: service.userId,
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio.value,
      duracionMinutos: service.duracionMinutos,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
