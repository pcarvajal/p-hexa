import { ConfirmationRequest } from '@gateway/application/ConfirmationRequest';
import { IntentionId } from '@gateway/domain/IntentionId';
import { IntentionNotExistError } from '@gateway/domain/IntentionNotExistError';
import { IntentionRepository } from '@gateway/domain/IntentionRepository';
import { NotificationClient } from '@gateway/infrastructure/rest/NotificationClient';

export class ConfirmationCreator {
  private readonly intentionRepository: IntentionRepository;
  private readonly notificationClient: NotificationClient;

  constructor({
    intentionRepository,
    notificationClient,
  }: {
    intentionRepository: IntentionRepository;
    notificationClient: NotificationClient;
  }) {
    this.intentionRepository = intentionRepository;
    this.notificationClient = notificationClient;
  }

  async execute(confirmationRequest: ConfirmationRequest): Promise<void> {
    await this.ensureIntentionExist(confirmationRequest.intentionId);

    const notification = await this.notificationClient.send({
      createdAt: new Date(),
      intentionId: confirmationRequest.intentionId,
      intentionState: confirmationRequest.state,
      paymentCommerce: confirmationRequest.commerce,
      paymentId: confirmationRequest.paymentId,
      paymentCurrency: confirmationRequest.currency,
      paymentTotal: confirmationRequest.total,
    });

    const intention = await this.intentionRepository.findById(
      new IntentionId({ value: confirmationRequest.intentionId }),
    );

    if (!intention) {
      throw new IntentionNotExistError();
    }

    intention.notificationValue = {
      state: notification.sent ? 'DELIVERED' : 'DELIVERY_PENDING',
      createdAt: notification.createdAt,
    };

    //Domain Event Pull notification

    intention.confirmationValue = { state: 'SUCCESS', createdAt: new Date() };

    //Domain Event Pull Confirmation

    await this.intentionRepository.save(intention);
  }

  private async ensureIntentionExist(intentionId: string): Promise<void> {
    const intentionRegistered = await this.intentionRepository.findById(
      new IntentionId({ value: intentionId }),
    );

    if (!intentionRegistered) {
      throw new IntentionNotExistError();
    }
  }
}
