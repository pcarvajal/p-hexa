import { DomainError } from '@shared/domain/DomainError';

export class AmountConsistencyError extends DomainError {
  readonly type = 'AmountConsistencyError';
  readonly message: string;

  constructor(
    public readonly itemTotal: number,
    public readonly intentionTotal: number,
  ) {
    super();
    this.message = 'The item total does not match the intention total';
  }
}
