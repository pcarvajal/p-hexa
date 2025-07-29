import { IntentionRequest } from '@gateway/application/IntentionRequest';
import decodeJWT from '@gateway/infrastructure/http/decodeJwt';
import { Uuid } from '@shared/domain/Uuid';


export class CreateIntentionRequestMapper {
  static tgrMapper(jwt: string): IntentionRequest {
    const decoded = decodeJWT(jwt);
    return {
      id: Uuid.random().toString(),
      paymentId: decoded.idOperacion,
      method: 'CHECKOUT_BUTTON',
      channel: 'WEB',
      commerce: 'TGR',
      items: [
        {
          sku: '000000001',
          name: 'Tax Payment',
          quantity: 1,
          price: parseInt(decoded.monto),
          total: parseInt(decoded.monto),
          description: 'Dummy item for TGR payment',
        },
      ],
      money: { currency: 'CLP', country: 'CL', total: parseInt(decoded.monto) },
      country: 'CL',
    };
  }
}
