import { randomUUID } from 'node:crypto';
import { Appointment } from '../../domain/entities/Appointment.js';
import { AppointmentStatus } from '../../domain/enums/AppointmentStatus.js';
import { AppointmentOverlapException } from '../../domain/exceptions/AppointmentOverlapException.js';
import { NotFoundException } from '../../domain/exceptions/NotFoundException.js';
import { ValidationException } from '../../domain/exceptions/ValidationException.js';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { CreateAppointmentDTO } from '../dto/AppointmentDTO.js';
import { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly clientRepository: IClientRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateAppointmentDTO,
  ): Promise<AppointmentResponseDTO> {
    const client = await this.clientRepository.findById(dto.clienteId);

    if (!client || client.userId !== userId) {
      throw new NotFoundException('Client', dto.clienteId);
    }

    const fechaInicio = new Date(dto.fechaInicio);
    let fechaFin: Date;

    if (dto.servicioId) {
      const service = await this.serviceRepository.findById(dto.servicioId);

      if (!service || service.userId !== userId) {
        throw new NotFoundException('Service', dto.servicioId);
      }

      fechaFin = new Date(
        fechaInicio.getTime() + service.duracionMinutos * 60_000,
      );
    } else if (dto.fechaFin) {
      fechaFin = new Date(dto.fechaFin);
    } else {
      throw new ValidationException(
        'fechaFin is required when no servicioId is provided',
      );
    }

    await this.checkOverlap(userId, fechaInicio, fechaFin);

    const appointment = Appointment.create({
      id: randomUUID(),
      userId,
      clienteId: dto.clienteId,
      servicioId: dto.servicioId ?? null,
      fechaInicio,
      fechaFin,
      notasCita: dto.notasCita ?? null,
    });

    const created = await this.appointmentRepository.create(appointment);

    return this.toResponse(created);
  }

  private async checkOverlap(
    userId: string,
    fechaInicio: Date,
    fechaFin: Date,
    excludeId?: string,
  ): Promise<void> {
    const overlapping = await this.appointmentRepository.findOverlapping({
      userId,
      fechaInicio,
      fechaFin,
      excludeId,
    });

    if (overlapping.length > 0) {
      throw new AppointmentOverlapException();
    }
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
