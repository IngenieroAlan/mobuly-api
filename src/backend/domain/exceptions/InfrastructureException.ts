import { DomainException } from "./DomainException.js";

export class InfrastructureException extends DomainException {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message, "INFRASTRUCTURE_ERROR");
  }
}
