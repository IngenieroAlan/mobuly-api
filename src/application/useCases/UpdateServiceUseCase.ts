import { Service } from '../../domain/entities/Service.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { UpdateServiceDTO } from '../dto/ServiceDTO.js';
import { ServiceResponseDTO } from '../dto/ServiceResponseDTO.js';
import { Price } from '../../domain/valueObjects/Price.js';

export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(
    userId: string,
    id: string,
    dto: UpdateServiceDTO,
  ): Promise<ServiceResponseDTO> {
    const existing = await this.serviceRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Service', id);
    }

    const updated = Service.create({
      id: existing.id,
      userId: existing.userId,
      nombre: dto.nombre ?? existing.nombre,
      descripcion:
        dto.descripcion !== undefined ? dto.descripcion : existing.descripcion,
      precio:
        dto.precio !== undefined ? Price.create(dto.precio) : existing.precio,
      duracionMinutos: dto.duracionMinutos ?? existing.duracionMinutos,
      createdAt: existing.createdAt,
    });

    const result = await this.serviceRepository.update(updated);

    return this.toResponse(result);
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
