import { ValidationException } from '../exceptions/ValidationException.js';

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw new ValidationException('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      throw new ValidationException('Invalid email format');
    }

    if (trimmed.length > 254) {
      throw new ValidationException('Email is too long (max 254 characters)');
    }

    return new Email(trimmed);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
