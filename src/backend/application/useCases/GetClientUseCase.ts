import { Client } from "../../domain/entities/Client.js";
import { NotFoundException } from "../../domain/exceptions/NotFoundException.js";
import { IClientRepository } from "../../domain/repositories/IClientRepository.js";

export class GetClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string, id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);

    if (!client || client.userId !== userId) {
      throw new NotFoundException("Client", id);
    }

    return client;
  }
}
