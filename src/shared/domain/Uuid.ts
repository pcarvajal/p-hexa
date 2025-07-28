import { randomUUID } from 'crypto';

import { InvalidArgumentError } from '@shared/domain/InvalidArgumentError';

export class Uuid {
  readonly value: string;

  constructor({ value }: { value: string }) {
    this.ensureIsValidUuid(value);

    this.value = value;
  }

  static random(): Uuid {
    return new Uuid({ value: randomUUID() });
  }

  private ensureIsValidUuid(id: string): void {
    const isValid = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );

    if (!isValid.test(id)) {
      throw new InvalidArgumentError({
        message: `<${this.constructor.name}> does not allow the value <${id}>`,
      });
    }
  }

  toString(): string {
    return this.value;
  }
}
