import { DomainException } from './DomainException.js';

export class AppointmentOverlapException extends DomainException {
  constructor() {
    super('Appointment overlaps with an existing one', 'APPOINTMENT_OVERLAP');
  }
}
