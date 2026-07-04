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
import { CreateClientSchema, UpdateClientSchema } from "../../application/dto/ClientDTO.js";
import type { CreateClientDTO, UpdateClientDTO } from "../../application/dto/ClientDTO.js";
import { CreateClientUseCase } from "../../application/useCases/CreateClientUseCase.js";
import { UpdateClientUseCase } from "../../application/useCases/UpdateClientUseCase.js";
import { GetClientUseCase } from "../../application/useCases/GetClientUseCase.js";
import { ListClientsUseCase } from "../../application/useCases/ListClientsUseCase.js";
import { DeleteClientUseCase } from "../../application/useCases/DeleteClientUseCase.js";

@Controller("api/clients")
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly listClientsUseCase: ListClientsUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateClientSchema)) dto: CreateClientDTO,
  ) {
    return this.createClientUseCase.execute(user.userId, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.listClientsUseCase.execute(user.userId);
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.getClientUseCase.execute(user.userId, id);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateClientSchema)) dto: UpdateClientDTO,
  ) {
    return this.updateClientUseCase.execute(user.userId, id, dto);
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    await this.deleteClientUseCase.execute(user.userId, id);

    return { message: "Client deleted successfully" };
  }
}
