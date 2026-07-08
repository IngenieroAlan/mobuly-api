import { Service } from '../../domain/entities/Service.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { ServiceResponseDTO } from '../dto/ServiceResponseDTO.js';

export class ListServicesUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string): Promise<ServiceResponseDTO[]> {
    const services = await this.serviceRepository.findByUserId(userId);

    return services.map((s) => this.toResponse(s));
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
