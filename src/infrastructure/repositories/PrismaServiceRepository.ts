import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/IServiceRepository.js';
import { Service } from '../../domain/entities/Service.js';
import { Price } from '../../domain/valueObjects/Price.js';
import { PrismaService } from '../prisma/PrismaService.js';

@Injectable()
export class PrismaServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } });

    return service ? this.toDomain(service) : null;
  }

  async findByUserId(userId: string): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return services.map((s) => this.toDomain(s));
  }

  async create(service: Service): Promise<Service> {
    const created = await this.prisma.service.create({
      data: {
        id: service.id,
        userId: service.userId,
        nombre: service.nombre,
        descripcion: service.descripcion,
        precio: service.precio.value,
        duracionMinutos: service.duracionMinutos,
      },
    });

    return this.toDomain(created);
  }

  async update(service: Service): Promise<Service> {
    const updated = await this.prisma.service.update({
      where: { id: service.id },
      data: {
        nombre: service.nombre,
        descripcion: service.descripcion,
        precio: service.precio.value,
        duracionMinutos: service.duracionMinutos,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
  }

  private toDomain(prismaService: {
    id: string;
    userId: string;
    nombre: string;
    descripcion: string | null;
    precio: any;
    duracionMinutos: number;
    createdAt: Date;
    updatedAt: Date;
  }): Service {
    return Service.create({
      id: prismaService.id,
      userId: prismaService.userId,
      nombre: prismaService.nombre,
      descripcion: prismaService.descripcion,
      precio: Price.create(Number(prismaService.precio)),
      duracionMinutos: prismaService.duracionMinutos,
      createdAt: prismaService.createdAt,
      updatedAt: prismaService.updatedAt,
    });
  }
}
