import { Service } from "../../domain/entities/Service.js";
import { NotFoundException } from "../../domain/exceptions/NotFoundException.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";

export class GetServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string, id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service || service.userId !== userId) {
      throw new NotFoundException("Service", id);
    }

    return service;
  }
}
