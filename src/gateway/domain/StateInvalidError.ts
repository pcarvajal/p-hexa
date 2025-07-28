import { DomainError } from '@shared/domain/DomainError';

export class StateInvalidError extends DomainError {
  readonly type = 'StateError';
  readonly message: string;

  constructor(
    public readonly requiredState: string,
    public readonly currentState: string,
  ) {
    super();
    this.message = 'required state does not match the current state';
  }
}
