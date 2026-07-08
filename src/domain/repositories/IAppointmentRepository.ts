import { Appointment } from '../entities/Appointment.js';
import { AppointmentStatus } from '../enums/AppointmentStatus.js';

export interface AppointmentOverlapQuery {
  userId: string;
  fechaInicio: Date;
  fechaFin: Date;
  excludeId?: string;
}

export interface AgendaFilters {
  userId: string;
  from: Date;
  to: Date;
  page: number;
  limit: number;
}

export interface AgendaEntry {
  date: string;
  appointments: Appointment[];
}

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByUserId(userId: string): Promise<Appointment[]>;
  findOverlapping(query: AppointmentOverlapQuery): Promise<Appointment[]>;
  findAgenda(filters: AgendaFilters): Promise<AgendaEntry[]>;
  create(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
}
