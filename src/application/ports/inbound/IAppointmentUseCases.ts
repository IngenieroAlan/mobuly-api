import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../../dto/AppointmentDTO.js';
import type { AppointmentResponseDTO } from '../../dto/AppointmentResponseDTO.js';
import type { AgendaResponseDTO } from '../../dto/AgendaResponseDTO.js';

export abstract class IAppointmentUseCases {
  abstract create(
    userId: string,
    dto: CreateAppointmentDTO,
  ): Promise<AppointmentResponseDTO>;
  abstract findAll(userId: string): Promise<AppointmentResponseDTO[]>;
  abstract findOne(userId: string, id: string): Promise<AppointmentResponseDTO>;
  abstract update(
    userId: string,
    id: string,
    dto: UpdateAppointmentDTO,
  ): Promise<AppointmentResponseDTO>;
  abstract delete(userId: string, id: string): Promise<void>;
  abstract getAgenda(
    userId: string,
    from: Date,
    to: Date,
    page: number,
    limit: number,
  ): Promise<AgendaResponseDTO>;
}
