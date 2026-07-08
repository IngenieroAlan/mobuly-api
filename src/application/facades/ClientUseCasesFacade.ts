import { IClientUseCases } from '../ports/inbound/IClientUseCases.js';
import type { CreateClientDTO, UpdateClientDTO } from '../dto/ClientDTO.js';
import type { ClientResponseDTO } from '../dto/ClientResponseDTO.js';
import { CreateClientUseCase } from '../useCases/CreateClientUseCase.js';
import { UpdateClientUseCase } from '../useCases/UpdateClientUseCase.js';
import { GetClientUseCase } from '../useCases/GetClientUseCase.js';
import { ListClientsUseCase } from '../useCases/ListClientsUseCase.js';
import { DeleteClientUseCase } from '../useCases/DeleteClientUseCase.js';

export class ClientUseCasesFacade extends IClientUseCases {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly getClient: GetClientUseCase,
    private readonly listClients: ListClientsUseCase,
    private readonly deleteClient: DeleteClientUseCase,
  ) {
    super();
  }

  async create(
    userId: string,
    dto: CreateClientDTO,
  ): Promise<ClientResponseDTO> {
    return this.createClient.execute(userId, dto);
  }

  async findAll(userId: string): Promise<ClientResponseDTO[]> {
    return this.listClients.execute(userId);
  }

  async findOne(userId: string, id: string): Promise<ClientResponseDTO> {
    return this.getClient.execute(userId, id);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateClientDTO,
  ): Promise<ClientResponseDTO> {
    return this.updateClient.execute(userId, id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    return this.deleteClient.execute(userId, id);
  }
}
