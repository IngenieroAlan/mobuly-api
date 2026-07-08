import { AppointmentStatus } from '../../domain/enums/AppointmentStatus.js';

export interface AppointmentResponseDTO {
  id: string;
  userId: string;
  clienteId: string;
  servicioId: string | null;
  fechaInicio: Date;
  fechaFin: Date;
  estado: AppointmentStatus;
  notasCita: string | null;
  createdAt: Date;
  updatedAt: Date;
}
