import type {
  CreateServiceDTO,
  UpdateServiceDTO,
} from '../../dto/ServiceDTO.js';
import type { ServiceResponseDTO } from '../../dto/ServiceResponseDTO.js';

export abstract class IServiceUseCases {
  abstract create(
    userId: string,
    dto: CreateServiceDTO,
  ): Promise<ServiceResponseDTO>;
  abstract findAll(userId: string): Promise<ServiceResponseDTO[]>;
  abstract findOne(userId: string, id: string): Promise<ServiceResponseDTO>;
  abstract update(
    userId: string,
    id: string,
    dto: UpdateServiceDTO,
  ): Promise<ServiceResponseDTO>;
  abstract delete(userId: string, id: string): Promise<void>;
}
