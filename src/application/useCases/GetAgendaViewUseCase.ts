import { Appointment } from '../../domain/entities/Appointment.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import type { AgendaResponseDTO } from '../dto/AgendaResponseDTO.js';
import type { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';

export class GetAgendaViewUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    userId: string,
    from: Date,
    to: Date,
    page: number,
    limit: number,
  ): Promise<AgendaResponseDTO> {
    const entries = await this.appointmentRepository.findAgenda({
      userId,
      from,
      to,
      page,
      limit,
    });

    const result: AgendaResponseDTO = {};

    for (const entry of entries) {
      result[entry.date] = entry.appointments.map((a) => this.toResponse(a));
    }

    return result;
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
