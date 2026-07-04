import { randomUUID } from "node:crypto";
import { Client } from "../../domain/entities/Client.js";
import { IClientRepository } from "../../domain/repositories/IClientRepository.js";
import { CreateClientDTO } from "../dto/ClientDTO.js";
import { Email } from "../../domain/valueObjects/Email.js";
import { Phone } from "../../domain/valueObjects/Phone.js";

export class CreateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(userId: string, dto: CreateClientDTO): Promise<Client> {
    const email = dto.email ? Email.create(dto.email) : null;
    const telefono = dto.telefono ? Phone.create(dto.telefono) : null;

    const client = Client.create({
      id: randomUUID(),
      userId,
      nombre: dto.nombre,
      apellido: dto.apellido,
      email,
      telefono,
      notasGenerales: dto.notasGenerales ?? null,
    });

    return this.clientRepository.create(client);
  }
}
