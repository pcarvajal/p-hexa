import { DomainError } from '@shared/domain/DomainError';

export class IntentionNotExistError extends DomainError {
  readonly type = 'IntentionNotExistError';
  readonly message: string;

  constructor(public readonly requestPaymentId?: string, commerce?: string, intentionId?: string) {
    super();
    this.message = 'The intention not exist';
  }
}
