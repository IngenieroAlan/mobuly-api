import { Injectable } from "@nestjs/common";
import { IAppointmentRepository, AppointmentOverlapQuery, AgendaFilters, AgendaEntry } from "../../domain/repositories/IAppointmentRepository.js";
import { Appointment } from "../../domain/entities/Appointment.js";
import { AppointmentStatus as DomainAppointmentStatus } from "../../domain/enums/AppointmentStatus.js";
import { PrismaService } from "../prisma/PrismaService.js";

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    return appointment ? this.toDomain(appointment) : null;
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { fechaInicio: "desc" },
    });

    return appointments.map((a) => this.toDomain(a));
  }

  async findOverlapping(query: AppointmentOverlapQuery): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        userId: query.userId,
        estado: { in: [DomainAppointmentStatus.PENDING as any, DomainAppointmentStatus.CONFIRMED as any] },
        fechaInicio: { lt: query.fechaFin },
        fechaFin: { gt: query.fechaInicio },
        ...(query.excludeId ? { id: { not: query.excludeId } } : {}),
      },
    });

    return appointments.map((a) => this.toDomain(a));
  }

  async findAgenda(filters: AgendaFilters): Promise<AgendaEntry[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        userId: filters.userId,
        estado: { not: DomainAppointmentStatus.CANCELLED as any },
        fechaInicio: { gte: filters.from },
        fechaFin: { lte: filters.to },
      },
      orderBy: { fechaInicio: "asc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    });

    const grouped = new Map<string, Appointment[]>();

    for (const appt of appointments) {
      const dateKey = appt.fechaInicio.toISOString().split("T")[0];
      const domainAppt = this.toDomain(appt);

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }

      grouped.get(dateKey)!.push(domainAppt);
    }

    const sortedKeys = Array.from(grouped.keys()).sort();

    return sortedKeys.map((date) => ({
      date,
      appointments: grouped.get(date)!,
    }));
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const created = await this.prisma.appointment.create({
      data: {
        id: appointment.id,
        userId: appointment.userId,
        clienteId: appointment.clienteId,
        servicioId: appointment.servicioId,
        fechaInicio: appointment.fechaInicio,
        fechaFin: appointment.fechaFin,
        estado: appointment.estado as any,
        notasCita: appointment.notasCita,
      },
    });

    return this.toDomain(created);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        clienteId: appointment.clienteId,
        servicioId: appointment.servicioId,
        fechaInicio: appointment.fechaInicio,
        fechaFin: appointment.fechaFin,
        estado: appointment.estado as any,
        notasCita: appointment.notasCita,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }

  private toDomain(prismaAppointment: {
    id: string;
    userId: string;
    clienteId: string;
    servicioId: string | null;
    fechaInicio: Date;
    fechaFin: Date;
    estado: any;
    notasCita: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Appointment {
    return Appointment.create({
      id: prismaAppointment.id,
      userId: prismaAppointment.userId,
      clienteId: prismaAppointment.clienteId,
      servicioId: prismaAppointment.servicioId,
      fechaInicio: prismaAppointment.fechaInicio,
      fechaFin: prismaAppointment.fechaFin,
      estado: prismaAppointment.estado as DomainAppointmentStatus,
      notasCita: prismaAppointment.notasCita,
      createdAt: prismaAppointment.createdAt,
      updatedAt: prismaAppointment.updatedAt,
    });
  }
}
