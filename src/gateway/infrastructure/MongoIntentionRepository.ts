import { IntentionRepository } from '@gateway/domain/IntentionRepository';
import { Intention } from '@gateway/domain/Intention';
import { Promise } from 'mongoose';

export class MongoIntentionRepository implements IntentionRepository{
  findById(id: string): Promise<Intention | null> {
    return Promise.resolve(undefined);
  }

  save(intention: Intention): Promise<void> {
    return Promise.resolve(undefined);
  }
}
