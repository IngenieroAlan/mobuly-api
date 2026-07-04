import { randomUUID } from "node:crypto";
import { Service } from "../../domain/entities/Service.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { CreateServiceDTO } from "../dto/ServiceDTO.js";
import { Price } from "../../domain/valueObjects/Price.js";

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string, dto: CreateServiceDTO): Promise<Service> {
    const service = Service.create({
      id: randomUUID(),
      userId,
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      precio: Price.create(dto.precio),
      duracionMinutos: dto.duracionMinutos,
    });

    return this.serviceRepository.create(service);
  }
}
