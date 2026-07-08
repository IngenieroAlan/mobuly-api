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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/JwtAuthGuard.js';
import { CurrentUser } from '../auth/CurrentUser.decorator.js';
import { ZodValidationPipe } from '../validators/ZodValidationPipe.js';
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
} from '../../application/dto/AppointmentDTO.js';
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../../application/dto/AppointmentDTO.js';
import { IAppointmentUseCases } from '../../application/ports/inbound/IAppointmentUseCases.js';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('api/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentUseCases: IAppointmentUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiCreatedResponse({ description: 'Appointment created successfully' })
  @ApiBody({ description: 'Appointment creation payload' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(CreateAppointmentSchema))
    dto: CreateAppointmentDTO,
  ) {
    return this.appointmentUseCases.create(user.userId, dto);
  }

  @Get('agenda')
  @ApiOperation({ summary: 'Get agenda view for a date range' })
  @ApiOkResponse({ description: 'Agenda grouped by date' })
  @ApiQuery({
    name: 'from',
    type: 'string',
    required: true,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'to',
    type: 'string',
    required: true,
    description: 'End date (ISO 8601)',
  })
  @ApiQuery({
    name: 'page',
    type: 'integer',
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: 'integer',
    required: false,
    description: 'Items per page',
  })
  async agenda(
    @CurrentUser() user: { userId: string },
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.appointmentUseCases.getAgenda(
      user.userId,
      new Date(from),
      new Date(to),
      page,
      limit,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all appointments' })
  @ApiOkResponse({ description: 'List of appointments' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.appointmentUseCases.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiOkResponse({ description: 'Appointment found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Appointment ID',
  })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.appointmentUseCases.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiOkResponse({ description: 'Appointment updated successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Appointment ID',
  })
  @ApiBody({ description: 'Appointment update payload' })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateAppointmentSchema))
    dto: UpdateAppointmentDTO,
  ) {
    return this.appointmentUseCases.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiOkResponse({ description: 'Appointment deleted successfully' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Appointment ID',
  })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.appointmentUseCases.delete(user.userId, id);

    return { message: 'Appointment deleted successfully' };
  }
}
