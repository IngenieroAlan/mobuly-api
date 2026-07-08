import { DomainException } from './DomainException.js';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`, 'NOT_FOUND');
  }
}
