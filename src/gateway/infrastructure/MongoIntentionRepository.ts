import { Error, Model, Promise } from 'mongoose';

import { Nullable } from '@shared/domain/nullable';
import { MongoClientFactory } from '@shared/infrastructure/mongodb/MongoClientFactory';

import { Intention } from '@gateway/domain/Intention';
import { IntentionId } from '@gateway/domain/IntentionId';
import { IntentionRepository } from '@gateway/domain/IntentionRepository';
import {
  IMongoIntention,
  MongoIntentionSchema,
} from '@gateway/infrastructure/MongoIntentionModel';

export class MongoIntentionRepository implements IntentionRepository {
  private readonly mongoIntentionModel: Model<IMongoIntention>;

  constructor({
    mongoClientFactory,
    mongoIntentionSchema,
  }: {
    mongoIntentionSchema: typeof MongoIntentionSchema;
    mongoClientFactory: MongoClientFactory;
  }) {
    const mongoConnection = mongoClientFactory.getClient('intention');
    if (!mongoConnection) {
      throw new Error(
        'MongoDB connection <<< intention >>> is not initialized',
      );
    }
    this.mongoIntentionModel = mongoConnection.model(
      'Intention',
      mongoIntentionSchema,
    );
  }

  async findById(id: IntentionId): Promise<Nullable<Intention>> {
    const document = await this.mongoIntentionModel
      .findOne<IMongoIntention>({ _id: id.value })
      .lean();

    return document ? this.toDomain(document) : null;
  }

  async save(intention: Intention): Promise<void> {
    await this.mongoIntentionModel.updateOne(
      { _id: intention.idValue },
      { ...intention.toScalars(), _id: intention.idValue },
      { upsert: true },
    );
  }

  async findByPaymentIdAndCommerce(
    requestPaymentId: string,
    commerce: string,
  ): Promise<Nullable<Intention>> {
    const document = await this.mongoIntentionModel
      .findOne<IMongoIntention>({
        requestPaymentId: requestPaymentId,
        commerce: commerce,
      })
      .lean();

    return document ? this.toDomain(document) : null;
  }

  private toDomain(intention: IMongoIntention): Intention {
    return Intention.fromScalars({
      id: intention._id.toString(),
      requestPaymentId: intention.requestPaymentId,
      commerce: intention.commerce,
      channel: intention.channel,
      country: intention.country,
      createdAt: intention.createdAt,
      money: {
        country: intention.money.country,
        amount: intention.money.amount,
        currency: intention.money.currency,
      },
      items: intention.items,
      notification: intention.notification ? intention.notification : null,
      confirmation: intention.confirmation ? intention.confirmation : null,
      operation: intention.operation ? intention.operation : null,
      state: intention.state,
      method: intention.method,
      updatedAt: intention.updatedAt,
    });
  }
}
