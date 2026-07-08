import { IServiceUseCases } from '../ports/inbound/IServiceUseCases.js';
import type { CreateServiceDTO, UpdateServiceDTO } from '../dto/ServiceDTO.js';
import type { ServiceResponseDTO } from '../dto/ServiceResponseDTO.js';
import { CreateServiceUseCase } from '../useCases/CreateServiceUseCase.js';
import { UpdateServiceUseCase } from '../useCases/UpdateServiceUseCase.js';
import { GetServiceUseCase } from '../useCases/GetServiceUseCase.js';
import { ListServicesUseCase } from '../useCases/ListServicesUseCase.js';
import { DeleteServiceUseCase } from '../useCases/DeleteServiceUseCase.js';

export class ServiceUseCasesFacade extends IServiceUseCases {
  constructor(
    private readonly createService: CreateServiceUseCase,
    private readonly updateService: UpdateServiceUseCase,
    private readonly getService: GetServiceUseCase,
    private readonly listServices: ListServicesUseCase,
    private readonly deleteService: DeleteServiceUseCase,
  ) {
    super();
  }

  async create(
    userId: string,
    dto: CreateServiceDTO,
  ): Promise<ServiceResponseDTO> {
    return this.createService.execute(userId, dto);
  }

  async findAll(userId: string): Promise<ServiceResponseDTO[]> {
    return this.listServices.execute(userId);
  }

  async findOne(userId: string, id: string): Promise<ServiceResponseDTO> {
    return this.getService.execute(userId, id);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateServiceDTO,
  ): Promise<ServiceResponseDTO> {
    return this.updateService.execute(userId, id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    return this.deleteService.execute(userId, id);
  }
}
