import { NotificationResponse } from '@gateway/application/repository/NotificationResponse';
import { NotificationRequest } from '@gateway/application/repository/NotificationRequest';

export interface NotificationRepository {
  send(notificationRequest: NotificationRequest): Promise<NotificationResponse>;
}
