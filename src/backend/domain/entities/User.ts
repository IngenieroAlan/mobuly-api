import { Email } from "../valueObjects/Email.js";

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly password: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    email: Email;
    password: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    const now = new Date();

    return new User(
      params.id,
      params.email,
      params.password,
      params.name,
      params.createdAt ?? now,
      params.updatedAt ?? now,
    );
  }
}
