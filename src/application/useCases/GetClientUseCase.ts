import { Client } from '../../domain/entities/Client.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { ClientResponseDTO } from '../dto/ClientResponseDTO.js';

export class GetClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string, id: string): Promise<ClientResponseDTO> {
    const client = await this.clientRepository.findById(id);

    if (!client || client.userId !== userId) {
      throw new NotFoundException('Client', id);
    }

    return this.toResponse(client);
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
