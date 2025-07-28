import { DomainError } from '@shared/domain/DomainError';

export class CountryAndCurrencyConsistencyError extends DomainError {
  readonly type = 'CountryAndCurrencyConsistencyError';
  readonly message: string;

  constructor(
    public readonly currency: string,
    public readonly country: string,
  ) {
    super();
    this.message = 'The money currency does not match the country';
  }
}
