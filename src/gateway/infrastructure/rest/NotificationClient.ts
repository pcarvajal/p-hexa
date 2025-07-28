import { NotificationRepository } from '@gateway/application/repository/NotificationRepository';
import { NotificationTgrAdapter } from '@gateway/infrastructure/rest/NotificationTgrAdapter';
import { NotificationResponse } from '@gateway/application/repository/NotificationResponse';
import { Commerce } from '@gateway/domain/Commerce';
import { assertNever } from '@shared/domain/assertNever';
import { NotificationRequest } from '@gateway/application/repository/NotificationRequest';


export class NotificationClient implements NotificationRepository {
  private readonly notificationTgrAdapter: NotificationTgrAdapter;

  constructor({
    notificationTgrAdapter,
  }: {
    notificationTgrAdapter: NotificationTgrAdapter;
  }) {
    this.notificationTgrAdapter = notificationTgrAdapter;
  }

  async send(
    notificationRequest: NotificationRequest,
  ): Promise<NotificationResponse> {
    switch (notificationRequest.paymentCommerce) {
      case Commerce.TGR:
        return await this.notificationTgrAdapter.send(notificationRequest);
      default:
        assertNever(notificationRequest.paymentCommerce as never)
    }
  }
}
