import { ValidationException } from '../exceptions/ValidationException.js';

export class Phone {
  private constructor(public readonly value: string) {}

  static create(value: string): Phone {
    const cleaned = value.replace(/[\s\-\(\)\+]/g, '');

    if (!cleaned) {
      throw new ValidationException('Phone number is required');
    }

    if (cleaned.length < 7 || cleaned.length > 15) {
      throw new ValidationException('Invalid phone number length');
    }

    if (!/^\d+$/.test(cleaned)) {
      throw new ValidationException('Phone number must contain only digits');
    }

    return new Phone(cleaned);
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }
}
