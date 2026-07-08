import type { CreateClientDTO, UpdateClientDTO } from '../../dto/ClientDTO.js';
import type { ClientResponseDTO } from '../../dto/ClientResponseDTO.js';

export abstract class IClientUseCases {
  abstract create(
    userId: string,
    dto: CreateClientDTO,
  ): Promise<ClientResponseDTO>;
  abstract findAll(userId: string): Promise<ClientResponseDTO[]>;
  abstract findOne(userId: string, id: string): Promise<ClientResponseDTO>;
  abstract update(
    userId: string,
    id: string,
    dto: UpdateClientDTO,
  ): Promise<ClientResponseDTO>;
  abstract delete(userId: string, id: string): Promise<void>;
}
