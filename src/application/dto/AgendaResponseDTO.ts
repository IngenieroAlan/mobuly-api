import type { AppointmentResponseDTO } from './AppointmentResponseDTO.js';

export interface AgendaResponseDTO {
  [date: string]: AppointmentResponseDTO[];
}
