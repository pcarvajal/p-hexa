import { PspTransaction, PspTransactionSchema } from '@gateway/infrastructure/rest/PspRestSchema';
import { Config } from '@apps/Config';
import { OperationRequest } from '@gateway/application/repository/OperationRequest';
import { OperationResponse } from '@gateway/application/repository/OperationResponse';


export class PspRestMapper {
  private readonly pspTransactionSchema: typeof PspTransactionSchema;
  private readonly config = Config;

  constructor({
    pspTransactionSchema,
    config,
  }: {
    pspTransactionSchema: typeof PspTransactionSchema;
    config: Config;
  }) {
    this.pspTransactionSchema = pspTransactionSchema;
    this.config = config;
  }

  toRequest(operationRequest: OperationRequest): PspTransaction {
    return this.pspTransactionSchema.parse({
      intent: 'sale',
      payment_method: 'EXPRESS_BF_ACCOUNT',
      buyer: { country: 'CL', document_number: '', document_type: 'RUT' },
      transaction: {
        purchase_order: '1',
        reconciliation_id: '1',
        merchant_unique_id: operationRequest.paymentId,
        description: 'Botón de pago TGR',
        soft_descriptor: 'TGR-PAYMENT',
        terminal_id: '101',
        store_id: '101',
        fpay_calculate_tax_subtotal: true,
        amount: {
          currency: operationRequest.currency.toUpperCase(),
          total: operationRequest.total,
          details: {
            subtotal: operationRequest.total,
            tax: 0,
            shipping: 0,
            shipping_discount: 0,
          },
          installments_number: 1,
          deferred_months_number: 0,
          without_interest: false,
        },
        item_list: {
          shipping_method: 'DIGITAL',
          items: [
            {
              sku: 'DUMMY_SKU',
              name: 'PAGO TGR',
              description: 'PAGO DESDE LA TGR',
              quantity: 1,
              price: operationRequest.total,
              tax: 0,
              item_id: '1',
            },
          ],
        },
        promotions: [],
        risk_additional_attributes: {
          captured_card_days: 0,
          transaction_related_merchant: `TGR:${operationRequest.intentionId}`,
        },
        entry_mode: 'TGR',
        aggregation_code: '1',
      },
      redirect_urls: {
        cancel_url: this.config.PSP_CANCEL_URL,
        return_url: this.config.PSP_RETURN_URL,
        adapter_notification_url: this.config.PSP_NOTIFY_URL,
      },
      additional_attributes: {
        tgr: {
          idOperacion: operationRequest.paymentId,
          intentionId: operationRequest.intentionId,
        },
        intentionId: operationRequest.intentionId,
      },
    });
  }

  toResponse(pspTransaction: PspTransaction): OperationResponse {
    if (pspTransaction.state !== 'created') {
      throw new Error(
        `PSP transaction is not in 'created' state, current state: ${pspTransaction.state}`,
      );
    }

    let callbackUrl = null;

    if (pspTransaction.links) {
      callbackUrl = pspTransaction.links.find(
        link => link.rel === 'approval_url' && link.method === 'REDIRECT',
      );
    }

    if (!callbackUrl || !callbackUrl.href)
      throw new Error('Callback URL not found in PSP transaction links');

    return {
      callbackUrl: callbackUrl.href,
      operationId: pspTransaction._id,
      intentionId: this.getIntentionId(
        pspTransaction.transaction.risk_additional_attributes
          .transaction_related_merchant,
      ),
      requestPaymentId: pspTransaction.transaction.merchant_unique_id,
    } as OperationResponse;
  }

  private getIntentionId(id: string): string {
    const tgrPrefix = 'TGR:';
    if (id.startsWith(tgrPrefix)) {
      return id.slice(tgrPrefix.length);
    }
    throw new Error(`${id} does not start with ${tgrPrefix}`);
  }
}
