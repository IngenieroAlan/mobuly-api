import { Appointment } from "../../domain/entities/Appointment.js";
import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository.js";

export class ListAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByUserId(userId);
  }
}
