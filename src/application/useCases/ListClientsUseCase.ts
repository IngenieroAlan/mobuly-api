import { Client } from '../../domain/entities/Client.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { ClientResponseDTO } from '../dto/ClientResponseDTO.js';

export class ListClientsUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string): Promise<ClientResponseDTO[]> {
    const clients = await this.clientRepository.findByUserId(userId);

    return clients.map((c) => this.toResponse(c));
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
