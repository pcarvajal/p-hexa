import { ConfirmationRequest } from '@contexts/confirmation/application/ConfirmationRequest';

export class ConfirmationRequestMapper {
  static pspMapper(body: any): ConfirmationRequest {
    let currency;

    if (body?.transaction?.amount?.currency) {
      currency = body.transaction.amount.currency.toLowerCase();
    }

    if (!currency) throw new Error('Currency is required');

    return {
      currency,
      intentionId: ConfirmationRequestMapper.intentionIdMapper(
        body.transaction.risk_additional_attributes
          .transaction_related_merchant,
      ),
      total: body.transaction.amount.total,
      commerce: body.transaction.entry_mode,
      paymentId: body.transaction.merchant_unique_id,
      state: ConfirmationRequestMapper.paymentStateMapper(body.state),
    };
  }

  static paymentStateMapper(state: string): string {
    switch (state) {
      case 'created':
        return 'CREATED';
      case 'received':
        return 'RECEIVED';
      case 'paid':
        return 'PAID';
      case 'canceled':
        return 'CANCELED';
      case 'refunded':
        return 'REFUNDED';
      case 'reversed':
        return 'REVERSED';
      case 'expired':
        return 'EXPIRED';
      case 'rejected':
        return 'REJECTED';
      case 'error':
        return 'ERROR';
      default:
        throw new Error(`Unknown payment state: ${state}`);
    }
  }

  static intentionIdMapper(string: string): string {
    if (!string) throw new Error('Intention ID is required');
    const parts = string.split(':');
    if (parts.length < 2) throw new Error('Invalid intention ID format');
    return parts[1];
  }
}
