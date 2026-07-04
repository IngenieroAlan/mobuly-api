import { Service } from "../../domain/entities/Service.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";

export class ListServicesUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string): Promise<Service[]> {
    return this.serviceRepository.findByUserId(userId);
  }
}
