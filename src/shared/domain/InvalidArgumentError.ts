import { DomainError } from '@shared/domain/DomainError';

export class InvalidArgumentError extends DomainError {
  readonly type = 'InvalidArgumentError';
  readonly message: string;
  constructor({ message }: { message?: string }) {
    super();
    this.message = message ?? 'Invalid argument provided';
  }
}
