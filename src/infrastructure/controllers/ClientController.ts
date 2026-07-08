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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/JwtAuthGuard.js';
import { CurrentUser } from '../auth/CurrentUser.decorator.js';
import { ZodValidationPipe } from '../validators/ZodValidationPipe.js';
import {
  CreateClientSchema,
  UpdateClientSchema,
} from '../../application/dto/ClientDTO.js';
import type {
  CreateClientDTO,
  UpdateClientDTO,
} from '../../application/dto/ClientDTO.js';
import { IClientUseCases } from '../../application/ports/inbound/IClientUseCases.js';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('api/clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientUseCases: IClientUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({ description: 'Client created successfully' })
  @ApiBody({ description: 'Client creation payload' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateClientSchema)) dto: CreateClientDTO,
  ) {
    return this.clientUseCases.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients' })
  @ApiOkResponse({ description: 'List of clients' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.clientUseCases.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiOkResponse({ description: 'Client found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Client ID',
  })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.clientUseCases.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiOkResponse({ description: 'Client updated successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Client ID',
  })
  @ApiBody({ description: 'Client update payload' })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateClientSchema)) dto: UpdateClientDTO,
  ) {
    return this.clientUseCases.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiOkResponse({ description: 'Client deleted successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Client ID',
  })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.clientUseCases.delete(user.userId, id);

    return { message: 'Client deleted successfully' };
  }
}
