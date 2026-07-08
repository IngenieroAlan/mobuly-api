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
  CreateServiceSchema,
  UpdateServiceSchema,
} from '../../application/dto/ServiceDTO.js';
import type {
  CreateServiceDTO,
  UpdateServiceDTO,
} from '../../application/dto/ServiceDTO.js';
import { IServiceUseCases } from '../../application/ports/inbound/IServiceUseCases.js';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('api/services')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceUseCases: IServiceUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiCreatedResponse({ description: 'Service created successfully' })
  @ApiBody({ description: 'Service creation payload' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateServiceSchema)) dto: CreateServiceDTO,
  ) {
    return this.serviceUseCases.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all services' })
  @ApiOkResponse({ description: 'List of services' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.serviceUseCases.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiOkResponse({ description: 'Service found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Service ID',
  })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.serviceUseCases.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiOkResponse({ description: 'Service updated successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Service ID',
  })
  @ApiBody({ description: 'Service update payload' })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) dto: UpdateServiceDTO,
  ) {
    return this.serviceUseCases.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiOkResponse({ description: 'Service deleted successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Service ID',
  })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.serviceUseCases.delete(user.userId, id);

    return { message: 'Service deleted successfully' };
  }
}
