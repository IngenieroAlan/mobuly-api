import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { Client } from '../../domain/entities/Client.js';
import { Email } from '../../domain/valueObjects/Email.js';
import { Phone } from '../../domain/valueObjects/Phone.js';
import { PrismaService } from '../prisma/PrismaService.js';

@Injectable()
export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });

    return client ? this.toDomain(client) : null;
  }

  async findByUserId(userId: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return clients.map(this.toDomain);
  }

  async create(client: Client): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        id: client.id,
        userId: client.userId,
        nombre: client.nombre,
        apellido: client.apellido,
        email: client.email?.value ?? null,
        telefono: client.telefono?.value ?? null,
        notasGenerales: client.notasGenerales,
      },
    });

    return this.toDomain(created);
  }

  async update(client: Client): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        nombre: client.nombre,
        apellido: client.apellido,
        email: client.email?.value ?? null,
        telefono: client.telefono?.value ?? null,
        notasGenerales: client.notasGenerales,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }

  private toDomain(prismaClient: {
    id: string;
    userId: string;
    nombre: string;
    apellido: string;
    email: string | null;
    telefono: string | null;
    notasGenerales: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Client {
    return Client.create({
      id: prismaClient.id,
      userId: prismaClient.userId,
      nombre: prismaClient.nombre,
      apellido: prismaClient.apellido,
      email: prismaClient.email ? Email.create(prismaClient.email) : null,
      telefono: prismaClient.telefono
        ? Phone.create(prismaClient.telefono)
        : null,
      notasGenerales: prismaClient.notasGenerales,
      createdAt: prismaClient.createdAt,
      updatedAt: prismaClient.updatedAt,
    });
  }
}
