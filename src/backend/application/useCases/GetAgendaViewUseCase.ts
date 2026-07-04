import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository.js";
import type { AgendaResponseDTO } from "../dto/AgendaResponseDTO.js";

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
      result[entry.date] = entry.appointments;
    }

    return result;
  }
}
