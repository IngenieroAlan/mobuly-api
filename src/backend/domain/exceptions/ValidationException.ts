import { DomainException } from "./DomainException.js";

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}
