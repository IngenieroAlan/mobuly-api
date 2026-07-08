import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';

export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.serviceRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Service', id);
    }

    await this.serviceRepository.delete(id);
  }
}
