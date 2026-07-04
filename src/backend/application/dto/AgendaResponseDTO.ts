import { Appointment } from "../../domain/entities/Appointment.js";

export interface AgendaResponseDTO {
  [date: string]: Appointment[];
}
