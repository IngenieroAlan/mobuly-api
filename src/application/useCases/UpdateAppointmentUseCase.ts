import { Appointment } from '../../domain/entities/Appointment.js';
import { AppointmentOverlapException } from '../../domain/exceptions/AppointmentOverlapException.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { UpdateAppointmentDTO } from '../dto/AppointmentDTO.js';
import { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';

export class UpdateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly clientRepository: IClientRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    userId: string,
    id: string,
    dto: UpdateAppointmentDTO,
  ): Promise<AppointmentResponseDTO> {
    const existing = await this.appointmentRepository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Appointment', id);
    }

    if (dto.clienteId) {
      const client = await this.clientRepository.findById(dto.clienteId);

      if (!client || client.userId !== userId) {
        throw new NotFoundException('Client', dto.clienteId);
      }
    }

    const servicioId =
      dto.servicioId !== undefined ? dto.servicioId : existing.servicioId;
    const fechaInicio = dto.fechaInicio
      ? new Date(dto.fechaInicio)
      : existing.fechaInicio;
    let fechaFin: Date;

    if (dto.servicioId && dto.fechaInicio) {
      const service = await this.serviceRepository.findById(dto.servicioId);

      if (!service || service.userId !== userId) {
        throw new NotFoundException('Service', dto.servicioId);
      }

      fechaFin = new Date(
        fechaInicio.getTime() + service.duracionMinutos * 60_000,
      );
    } else if (dto.fechaFin) {
      fechaFin = new Date(dto.fechaFin);
    } else if (dto.servicioId && !dto.fechaInicio) {
      const service = await this.serviceRepository.findById(dto.servicioId);

      if (!service || service.userId !== userId) {
        throw new NotFoundException('Service', dto.servicioId);
      }

      fechaFin = new Date(
        fechaInicio.getTime() + service.duracionMinutos * 60_000,
      );
    } else {
      fechaFin = existing.fechaFin;
    }

    const overlapCheckNeeded =
      dto.fechaInicio || dto.fechaFin || dto.servicioId !== undefined;

    if (overlapCheckNeeded) {
      const overlapping = await this.appointmentRepository.findOverlapping({
        userId,
        fechaInicio,
        fechaFin,
        excludeId: id,
      });

      if (overlapping.length > 0) {
        throw new AppointmentOverlapException();
      }
    }

    const updated = Appointment.create({
      id: existing.id,
      userId: existing.userId,
      clienteId: dto.clienteId ?? existing.clienteId,
      servicioId,
      fechaInicio,
      fechaFin,
      estado: dto.estado ?? existing.estado,
      notasCita:
        dto.notasCita !== undefined ? dto.notasCita : existing.notasCita,
      createdAt: existing.createdAt,
    });

    const result = await this.appointmentRepository.update(updated);

    return this.toResponse(result);
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
