import { Client } from "../../domain/entities/Client.js";
import { IClientRepository } from "../../domain/repositories/IClientRepository.js";

export class ListClientsUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string): Promise<Client[]> {
    return this.clientRepository.findByUserId(userId);
  }
}
