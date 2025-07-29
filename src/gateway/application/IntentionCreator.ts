import { InvalidArgumentError } from '@shared/domain/InvalidArgumentError';

import { IntentionRequest } from '@gateway/application/IntentionRequest';
import { OperationRepository } from '@gateway/application/repository/OperationRepository';
import { Intention } from '@gateway/domain/Intention';
import { IntentionId } from '@gateway/domain/IntentionId';
import { IntentionNotExistError } from '@gateway/domain/IntentionNotExistError';
import { IntentionRepository } from '@gateway/domain/IntentionRepository';
import { State } from '@gateway/domain/State';

export type CreateIntentionError =
  | InvalidArgumentError
  | IntentionNotExistError;

export class IntentionCreator {
  private readonly intentionRepository: IntentionRepository;
  private operationRepository: OperationRepository;

  constructor({
    intentionRepository,
    operationRepository,
  }: {
    intentionRepository: IntentionRepository;
    operationRepository: OperationRepository;
  }) {
    this.intentionRepository = intentionRepository;
    this.operationRepository = operationRepository;
  }

  async execute(params: IntentionRequest): Promise<void> {
    await this.ensureIntentionDoesNotExist(params.paymentId, params.commerce);
    const now = new Date();

    const intention = Intention.create({
      id: params.id,
      requestPaymentId: params.paymentId,
      commerce: params.commerce,
      method: params.method,
      channel: params.channel,
      items: params.items,
      country: params.country,
      money: {
        country: params.country,
        amount: params.money.total,
        currency: params.money.currency,
      },
      operation: null,
      notification: null,
      confirmation: null,
      state: State.CREATED,
      updatedAt: now,
      createdAt: now,
    });

    await this.intentionRepository.save(intention);

    const operation = await this.operationRepository.create({
      intentionId: intention.idValue,
      currency: params.money.currency,
      items: params.items,
      paymentId: params.paymentId,
      total: params.money.total,
    });

    const savedIntention = await this.intentionRepository.findById(
      new IntentionId({ value: intention.idValue }),
    );

    if (!savedIntention) {
      throw new IntentionNotExistError(params.paymentId, params.commerce);
    }

    savedIntention.operationValue = {
      pspId: operation.operationId,
      callbackUrl: operation.callbackUrl,
      createdAt: new Date(),
    };

    await this.intentionRepository.save(savedIntention);
  }

  private async ensureIntentionDoesNotExist(
    requestPaymentId: string,
    commerce: string,
  ): Promise<void> {
    const intentionRegistered =
      await this.intentionRepository.findByPaymentIdAndCommerce(
        requestPaymentId,
        commerce,
      );

    if (intentionRegistered) {
      throw new IntentionNotExistError(requestPaymentId, commerce);
    }
  }
}
