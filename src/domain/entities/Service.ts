import { Price } from '../valueObjects/Price.js';

export class Service {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly precio: Price,
    public readonly duracionMinutos: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    nombre: string;
    descripcion?: string | null;
    precio: Price;
    duracionMinutos: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): Service {
    const now = new Date();

    return new Service(
      params.id,
      params.userId,
      params.nombre,
      params.descripcion ?? null,
      params.precio,
      params.duracionMinutos,
      params.createdAt ?? now,
      params.updatedAt ?? now,
    );
  }
}
