import { Uuid } from '@shared/domain/Uuid';

export class IntentionId extends Uuid {
  constructor({ value }: { value: string }) {
    super({ value });
  }
}
