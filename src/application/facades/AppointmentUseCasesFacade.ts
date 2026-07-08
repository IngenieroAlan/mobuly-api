import { IAppointmentUseCases } from '../ports/inbound/IAppointmentUseCases.js';
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../dto/AppointmentDTO.js';
import type { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO.js';
import type { AgendaResponseDTO } from '../dto/AgendaResponseDTO.js';
import { CreateAppointmentUseCase } from '../useCases/CreateAppointmentUseCase.js';
import { UpdateAppointmentUseCase } from '../useCases/UpdateAppointmentUseCase.js';
import { GetAppointmentUseCase } from '../useCases/GetAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '../useCases/ListAppointmentsUseCase.js';
import { DeleteAppointmentUseCase } from '../useCases/DeleteAppointmentUseCase.js';
import { GetAgendaViewUseCase } from '../useCases/GetAgendaViewUseCase.js';

export class AppointmentUseCasesFacade extends IAppointmentUseCases {
  constructor(
    private readonly createAppointment: CreateAppointmentUseCase,
    private readonly updateAppointment: UpdateAppointmentUseCase,
    private readonly getAppointment: GetAppointmentUseCase,
    private readonly listAppointments: ListAppointmentsUseCase,
    private readonly deleteAppointment: DeleteAppointmentUseCase,
    private readonly getAgendaView: GetAgendaViewUseCase,
  ) {
    super();
  }

  async create(
    userId: string,
    dto: CreateAppointmentDTO,
  ): Promise<AppointmentResponseDTO> {
    return this.createAppointment.execute(userId, dto);
  }

  async findAll(userId: string): Promise<AppointmentResponseDTO[]> {
    return this.listAppointments.execute(userId);
  }

  async findOne(userId: string, id: string): Promise<AppointmentResponseDTO> {
    return this.getAppointment.execute(userId, id);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAppointmentDTO,
  ): Promise<AppointmentResponseDTO> {
    return this.updateAppointment.execute(userId, id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    return this.deleteAppointment.execute(userId, id);
  }

  async getAgenda(
    userId: string,
    from: Date,
    to: Date,
    page: number,
    limit: number,
  ): Promise<AgendaResponseDTO> {
    return this.getAgendaView.execute(userId, from, to, page, limit);
  }
}
