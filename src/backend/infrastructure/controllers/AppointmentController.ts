import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/JwtAuthGuard.js";
import { CurrentUser } from "../auth/CurrentUser.decorator.js";
import { ZodValidationPipe } from "../validators/ZodValidationPipe.js";
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
} from "../../application/dto/AppointmentDTO.js";
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../../application/dto/AppointmentDTO.js";
import { CreateAppointmentUseCase } from "../../application/useCases/CreateAppointmentUseCase.js";
import { UpdateAppointmentUseCase } from "../../application/useCases/UpdateAppointmentUseCase.js";
import { GetAppointmentUseCase } from "../../application/useCases/GetAppointmentUseCase.js";
import { ListAppointmentsUseCase } from "../../application/useCases/ListAppointmentsUseCase.js";
import { DeleteAppointmentUseCase } from "../../application/useCases/DeleteAppointmentUseCase.js";
import { GetAgendaViewUseCase } from "../../application/useCases/GetAgendaViewUseCase.js";

@Controller("api/appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly getAppointmentUseCase: GetAppointmentUseCase,
    private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
    private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase,
    private readonly getAgendaViewUseCase: GetAgendaViewUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateAppointmentSchema)) dto: CreateAppointmentDTO,
  ) {
    return this.createAppointmentUseCase.execute(user.userId, dto);
  }

  @Get("agenda")
  async agenda(
    @CurrentUser() user: { userId: string },
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("page", new ParseIntPipe({ optional: true })) page = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.getAgendaViewUseCase.execute(
      user.userId,
      new Date(from),
      new Date(to),
      page,
      limit,
    );
  }

  @Get()
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.listAppointmentsUseCase.execute(user.userId);
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.getAppointmentUseCase.execute(user.userId, id);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateAppointmentSchema)) dto: UpdateAppointmentDTO,
  ) {
    return this.updateAppointmentUseCase.execute(user.userId, id, dto);
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    await this.deleteAppointmentUseCase.execute(user.userId, id);

    return { message: "Appointment deleted successfully" };
  }
}
