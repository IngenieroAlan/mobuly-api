import { Service } from '../../domain/entities/Service.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { ServiceResponseDTO } from '../dto/ServiceResponseDTO.js';

export class GetServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string, id: string): Promise<ServiceResponseDTO> {
    const service = await this.serviceRepository.findById(id);

    if (!service || service.userId !== userId) {
      throw new NotFoundException('Service', id);
    }

    return this.toResponse(service);
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
