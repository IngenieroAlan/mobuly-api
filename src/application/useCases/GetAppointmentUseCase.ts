import { Appointment } from '../../domain/entities/Appointment.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';

export class GetAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string, id: string): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment || appointment.userId !== userId) {
      throw new NotFoundException('Appointment', id);
    }

    return this.toResponse(appointment);
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
