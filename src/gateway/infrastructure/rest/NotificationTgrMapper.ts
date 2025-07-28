import { NotificationResponse } from '@gateway/application/repository/NotificationResponse';
import { NotificationRequest } from '@gateway/application/repository/NotificationRequest';


export class NotificationTgrMapper {
  static toRequest(notificationRequest: NotificationRequest): any {
    return {
      idOperacion: notificationRequest.paymentId,
      monto: notificationRequest.paymentTotal,
      moneda: notificationRequest.paymentCurrency,
      resultado: this.stateMapper(notificationRequest.intentionState!),
    };
  }

  static toResponse(notificationResponse: {
    resultado: string;
    fechaRespuesta: string;
  }): NotificationResponse {
    return {
      sent: notificationResponse.resultado === 'OK',
      createdAt: new Date(notificationResponse.fechaRespuesta),
    } as NotificationResponse;
  }

  private static stateMapper(state: string) {
    switch (state) {
      case 'PAID':
        return 'OK';
      default:
        return 'NOK';
    }
  }
}
