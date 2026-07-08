import { Email } from '../valueObjects/Email.js';
import { Phone } from '../valueObjects/Phone.js';

export class Client {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly email: Email | null,
    public readonly telefono: Phone | null,
    public readonly notasGenerales: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    nombre: string;
    apellido: string;
    email?: Email | null;
    telefono?: Phone | null;
    notasGenerales?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Client {
    const now = new Date();

    return new Client(
      params.id,
      params.userId,
      params.nombre,
      params.apellido,
      params.email ?? null,
      params.telefono ?? null,
      params.notasGenerales ?? null,
      params.createdAt ?? now,
      params.updatedAt ?? now,
    );
  }
}
