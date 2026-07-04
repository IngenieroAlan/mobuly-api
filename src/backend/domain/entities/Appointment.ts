import { AppointmentStatus } from "../enums/AppointmentStatus.js";

export class Appointment {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly clienteId: string,
    public readonly servicioId: string | null,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly estado: AppointmentStatus,
    public readonly notasCita: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    clienteId: string;
    servicioId?: string | null;
    fechaInicio: Date;
    fechaFin: Date;
    estado?: AppointmentStatus;
    notasCita?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Appointment {
    const now = new Date();

    return new Appointment(
      params.id,
      params.userId,
      params.clienteId,
      params.servicioId ?? null,
      params.fechaInicio,
      params.fechaFin,
      params.estado ?? AppointmentStatus.PENDING,
      params.notasCita ?? null,
      params.createdAt ?? now,
      params.updatedAt ?? now,
    );
  }

  isPendingOrConfirmed(): boolean {
    return (
      this.estado === AppointmentStatus.PENDING ||
      this.estado === AppointmentStatus.CONFIRMED
    );
  }
}
