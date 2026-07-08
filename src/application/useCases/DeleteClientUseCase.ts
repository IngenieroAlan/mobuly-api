import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';

export class DeleteClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.clientRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Client', id);
    }

    await this.clientRepository.delete(id);
  }
}
