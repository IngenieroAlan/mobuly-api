import { Client } from '../../domain/entities/Client.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { UpdateClientDTO } from '../dto/ClientDTO.js';
import { ClientResponseDTO } from '../dto/ClientResponseDTO.js';
import { Email } from '../../domain/valueObjects/Email.js';
import { Phone } from '../../domain/valueObjects/Phone.js';

export class UpdateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(
    userId: string,
    id: string,
    dto: UpdateClientDTO,
  ): Promise<ClientResponseDTO> {
    const existing = await this.clientRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Client', id);
    }

    const email =
      dto.email !== undefined
        ? dto.email
          ? Email.create(dto.email)
          : null
        : existing.email;

    const telefono =
      dto.telefono !== undefined
        ? dto.telefono
          ? Phone.create(dto.telefono)
          : null
        : existing.telefono;

    const updated = Client.create({
      id: existing.id,
      userId: existing.userId,
      nombre: dto.nombre ?? existing.nombre,
      apellido: dto.apellido ?? existing.apellido,
      email,
      telefono,
      notasGenerales:
        dto.notasGenerales !== undefined
          ? dto.notasGenerales
          : existing.notasGenerales,
      createdAt: existing.createdAt,
    });

    const result = await this.clientRepository.update(updated);

    return this.toResponse(result);
  }

  private toResponse(client: Client): ClientResponseDTO {
    return {
      id: client.id,
      userId: client.userId,
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email?.value ?? null,
      telefono: client.telefono?.value ?? null,
      notasGenerales: client.notasGenerales,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
