import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';

export class DeleteAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.appointmentRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Appointment', id);
    }

    await this.appointmentRepository.delete(id);
  }
}
