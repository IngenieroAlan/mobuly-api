import { Appointment } from '../../domain/entities/Appointment.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';

export class ListAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string): Promise<AppointmentResponseDTO[]> {
    const appointments = await this.appointmentRepository.findByUserId(userId);

    return appointments.map((a) => this.toResponse(a));
  }

  private toResponse(appointment: Appointment): AppointmentResponseDTO {
    return {
      id: appointment.id,
      userId: appointment.userId,
      clienteId: appointment.clienteId,
      servicioId: appointment.servicioId,
      fechaInicio: appointment.fechaInicio,
      fechaFin: appointment.fechaFin,
      estado: appointment.estado,
      notasCita: appointment.notasCita,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
