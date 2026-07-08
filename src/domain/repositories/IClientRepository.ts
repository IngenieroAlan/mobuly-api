import { Client } from '../entities/Client.js';

export interface IClientRepository {
  findById(id: string): Promise<Client | null>;
  findByUserId(userId: string): Promise<Client[]>;
  create(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}
