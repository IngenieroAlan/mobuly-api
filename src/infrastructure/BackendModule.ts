import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { PrismaModule } from './prisma/PrismaModule.js';
import { LoggerModule } from './logger/LoggerModule.js';
import { AuthModule } from './auth/AuthModule.js';

import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaClientRepository } from './repositories/PrismaClientRepository.js';
import { PrismaServiceRepository } from './repositories/PrismaServiceRepository.js';
import { PrismaAppointmentRepository } from './repositories/PrismaAppointmentRepository.js';
import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { IClientRepository } from '../domain/repositories/IClientRepository.js';
import type { IServiceRepository } from '../domain/repositories/IServiceRepository.js';
import type { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository.js';

import { CreateClientUseCase } from '../application/useCases/CreateClientUseCase.js';
import { UpdateClientUseCase } from '../application/useCases/UpdateClientUseCase.js';
import { GetClientUseCase } from '../application/useCases/GetClientUseCase.js';
import { ListClientsUseCase } from '../application/useCases/ListClientsUseCase.js';
import { DeleteClientUseCase } from '../application/useCases/DeleteClientUseCase.js';

import { CreateServiceUseCase } from '../application/useCases/CreateServiceUseCase.js';
import { UpdateServiceUseCase } from '../application/useCases/UpdateServiceUseCase.js';
import { GetServiceUseCase } from '../application/useCases/GetServiceUseCase.js';
import { ListServicesUseCase } from '../application/useCases/ListServicesUseCase.js';
import { DeleteServiceUseCase } from '../application/useCases/DeleteServiceUseCase.js';

import { CreateAppointmentUseCase } from '../application/useCases/CreateAppointmentUseCase.js';
import { UpdateAppointmentUseCase } from '../application/useCases/UpdateAppointmentUseCase.js';
import { GetAppointmentUseCase } from '../application/useCases/GetAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '../application/useCases/ListAppointmentsUseCase.js';
import { DeleteAppointmentUseCase } from '../application/useCases/DeleteAppointmentUseCase.js';
import { GetAgendaViewUseCase } from '../application/useCases/GetAgendaViewUseCase.js';

import { ClientUseCasesFacade } from '../application/facades/ClientUseCasesFacade.js';
import { ServiceUseCasesFacade } from '../application/facades/ServiceUseCasesFacade.js';
import { AppointmentUseCasesFacade } from '../application/facades/AppointmentUseCasesFacade.js';

import { IClientUseCases } from '../application/ports/inbound/IClientUseCases.js';
import { IServiceUseCases } from '../application/ports/inbound/IServiceUseCases.js';
import { IAppointmentUseCases } from '../application/ports/inbound/IAppointmentUseCases.js';

import { ClientController } from './controllers/ClientController.js';
import { ServiceController } from './controllers/ServiceController.js';
import { AppointmentController } from './controllers/AppointmentController.js';

import { DomainExceptionFilter } from './validators/DomainExceptionFilter.js';
import { LoggerService } from './logger/LoggerService.js';

const REPOSITORY_TOKENS = {
  USER: 'IUserRepository',
  CLIENT: 'IClientRepository',
  SERVICE: 'IServiceRepository',
  APPOINTMENT: 'IAppointmentRepository',
} as const;

@Module({
  imports: [PrismaModule, LoggerModule, AuthModule],
  controllers: [ClientController, ServiceController, AppointmentController],
  providers: [
    {
      provide: REPOSITORY_TOKENS.USER,
      useClass: PrismaUserRepository,
    },
    {
      provide: REPOSITORY_TOKENS.CLIENT,
      useClass: PrismaClientRepository,
    },
    {
      provide: REPOSITORY_TOKENS.SERVICE,
      useClass: PrismaServiceRepository,
    },
    {
      provide: REPOSITORY_TOKENS.APPOINTMENT,
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: CreateClientUseCase,
      useFactory: (repo: IClientRepository) => new CreateClientUseCase(repo),
      inject: [REPOSITORY_TOKENS.CLIENT],
    },
    {
      provide: UpdateClientUseCase,
      useFactory: (repo: IClientRepository) => new UpdateClientUseCase(repo),
      inject: [REPOSITORY_TOKENS.CLIENT],
    },
    {
      provide: GetClientUseCase,
      useFactory: (repo: IClientRepository) => new GetClientUseCase(repo),
      inject: [REPOSITORY_TOKENS.CLIENT],
    },
    {
      provide: ListClientsUseCase,
      useFactory: (repo: IClientRepository) => new ListClientsUseCase(repo),
      inject: [REPOSITORY_TOKENS.CLIENT],
    },
    {
      provide: DeleteClientUseCase,
      useFactory: (repo: IClientRepository) => new DeleteClientUseCase(repo),
      inject: [REPOSITORY_TOKENS.CLIENT],
    },
    {
      provide: CreateServiceUseCase,
      useFactory: (repo: IServiceRepository) => new CreateServiceUseCase(repo),
      inject: [REPOSITORY_TOKENS.SERVICE],
    },
    {
      provide: UpdateServiceUseCase,
      useFactory: (repo: IServiceRepository) => new UpdateServiceUseCase(repo),
      inject: [REPOSITORY_TOKENS.SERVICE],
    },
    {
      provide: GetServiceUseCase,
      useFactory: (repo: IServiceRepository) => new GetServiceUseCase(repo),
      inject: [REPOSITORY_TOKENS.SERVICE],
    },
    {
      provide: ListServicesUseCase,
      useFactory: (repo: IServiceRepository) => new ListServicesUseCase(repo),
      inject: [REPOSITORY_TOKENS.SERVICE],
    },
    {
      provide: DeleteServiceUseCase,
      useFactory: (repo: IServiceRepository) => new DeleteServiceUseCase(repo),
      inject: [REPOSITORY_TOKENS.SERVICE],
    },
    {
      provide: CreateAppointmentUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        clientRepo: IClientRepository,
        serviceRepo: IServiceRepository,
      ) =>
        new CreateAppointmentUseCase(appointmentRepo, clientRepo, serviceRepo),
      inject: [
        REPOSITORY_TOKENS.APPOINTMENT,
        REPOSITORY_TOKENS.CLIENT,
        REPOSITORY_TOKENS.SERVICE,
      ],
    },
    {
      provide: UpdateAppointmentUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        clientRepo: IClientRepository,
        serviceRepo: IServiceRepository,
      ) =>
        new UpdateAppointmentUseCase(appointmentRepo, clientRepo, serviceRepo),
      inject: [
        REPOSITORY_TOKENS.APPOINTMENT,
        REPOSITORY_TOKENS.CLIENT,
        REPOSITORY_TOKENS.SERVICE,
      ],
    },
    {
      provide: GetAppointmentUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetAppointmentUseCase(repo),
      inject: [REPOSITORY_TOKENS.APPOINTMENT],
    },
    {
      provide: ListAppointmentsUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new ListAppointmentsUseCase(repo),
      inject: [REPOSITORY_TOKENS.APPOINTMENT],
    },
    {
      provide: DeleteAppointmentUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new DeleteAppointmentUseCase(repo),
      inject: [REPOSITORY_TOKENS.APPOINTMENT],
    },
    {
      provide: GetAgendaViewUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetAgendaViewUseCase(repo),
      inject: [REPOSITORY_TOKENS.APPOINTMENT],
    },
    {
      provide: IClientUseCases,
      useFactory: (
        create: CreateClientUseCase,
        update: UpdateClientUseCase,
        get: GetClientUseCase,
        list: ListClientsUseCase,
        del: DeleteClientUseCase,
      ) => new ClientUseCasesFacade(create, update, get, list, del),
      inject: [
        CreateClientUseCase,
        UpdateClientUseCase,
        GetClientUseCase,
        ListClientsUseCase,
        DeleteClientUseCase,
      ],
    },
    {
      provide: IServiceUseCases,
      useFactory: (
        create: CreateServiceUseCase,
        update: UpdateServiceUseCase,
        get: GetServiceUseCase,
        list: ListServicesUseCase,
        del: DeleteServiceUseCase,
      ) => new ServiceUseCasesFacade(create, update, get, list, del),
      inject: [
        CreateServiceUseCase,
        UpdateServiceUseCase,
        GetServiceUseCase,
        ListServicesUseCase,
        DeleteServiceUseCase,
      ],
    },
    {
      provide: IAppointmentUseCases,
      useFactory: (
        create: CreateAppointmentUseCase,
        update: UpdateAppointmentUseCase,
        get: GetAppointmentUseCase,
        list: ListAppointmentsUseCase,
        del: DeleteAppointmentUseCase,
        agenda: GetAgendaViewUseCase,
      ) =>
        new AppointmentUseCasesFacade(create, update, get, list, del, agenda),
      inject: [
        CreateAppointmentUseCase,
        UpdateAppointmentUseCase,
        GetAppointmentUseCase,
        ListAppointmentsUseCase,
        DeleteAppointmentUseCase,
        GetAgendaViewUseCase,
      ],
    },
    {
      provide: APP_FILTER,
      useFactory: (logger: LoggerService) => new DomainExceptionFilter(logger),
      inject: [LoggerService],
    },
  ],
})
export class BackendModule {}
