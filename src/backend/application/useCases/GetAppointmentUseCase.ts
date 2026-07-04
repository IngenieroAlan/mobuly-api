import { Appointment } from "../../domain/entities/Appointment.js";
import { NotFoundException } from "../../domain/exceptions/NotFoundException.js";
import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository.js";

export class GetAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string, id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment || appointment.userId !== userId) {
      throw new NotFoundException("Appointment", id);
    }

    return appointment;
  }
}
