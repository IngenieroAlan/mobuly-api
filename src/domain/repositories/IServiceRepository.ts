import { Service } from '../entities/Service.js';

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
  findByUserId(userId: string): Promise<Service[]>;
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
}
