import { ValidationException } from "../exceptions/ValidationException.js";

export class Price {
  private constructor(public readonly value: number) {}

  static create(value: number): Price {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new ValidationException("Price must be a valid number");
    }

    if (value < 0) {
      throw new ValidationException("Price cannot be negative");
    }

    const rounded = Math.round(value * 100) / 100;

    return new Price(rounded);
  }

  add(other: Price): Price {
    return Price.create(this.value + other.value);
  }

  subtract(other: Price): Price {
    return Price.create(this.value - other.value);
  }

  multiply(factor: number): Price {
    return Price.create(this.value * factor);
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
