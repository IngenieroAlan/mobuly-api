import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/JwtAuthGuard.js";
import { CurrentUser } from "../auth/CurrentUser.decorator.js";
import { ZodValidationPipe } from "../validators/ZodValidationPipe.js";
import { CreateServiceSchema, UpdateServiceSchema } from "../../application/dto/ServiceDTO.js";
import type { CreateServiceDTO, UpdateServiceDTO } from "../../application/dto/ServiceDTO.js";
import { CreateServiceUseCase } from "../../application/useCases/CreateServiceUseCase.js";
import { UpdateServiceUseCase } from "../../application/useCases/UpdateServiceUseCase.js";
import { GetServiceUseCase } from "../../application/useCases/GetServiceUseCase.js";
import { ListServicesUseCase } from "../../application/useCases/ListServicesUseCase.js";
import { DeleteServiceUseCase } from "../../application/useCases/DeleteServiceUseCase.js";

@Controller("api/services")
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly listServicesUseCase: ListServicesUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateServiceSchema)) dto: CreateServiceDTO,
  ) {
    return this.createServiceUseCase.execute(user.userId, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.listServicesUseCase.execute(user.userId);
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.getServiceUseCase.execute(user.userId, id);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) dto: UpdateServiceDTO,
  ) {
    return this.updateServiceUseCase.execute(user.userId, id, dto);
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    await this.deleteServiceUseCase.execute(user.userId, id);

    return { message: "Service deleted successfully" };
  }
}
