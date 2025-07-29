import { fakerES } from '@faker-js/faker';

import { IntentionRequest } from '@gateway/application/IntentionRequest';
import { OperationRequest } from '@gateway/application/repository/OperationRequest';
import { Channel } from '@gateway/domain/Channel';
import { Commerce } from '@gateway/domain/Commerce';
import { Country } from '@gateway/domain/Country';
import { Currency } from '@gateway/domain/Currency';
import { Intention, IntentionScalars } from '@gateway/domain/Intention';
import { PaymentMethod } from '@gateway/domain/PaymentMethod';
import { State } from '@gateway/domain/State';

export class IntentionMother {
  static random(): Intention {
    const now = new Date();
    return Intention.create({
      id: fakerES.string.uuid(),
      requestPaymentId: fakerES.string.alpha(10),
      country: this.generateValidRandomMoney().country,
      commerce: fakerES.helpers.enumValue(Commerce),
      channel: fakerES.helpers.enumValue(Channel),
      method: fakerES.helpers.enumValue(PaymentMethod),
      money: this.generateValidRandomMoney(),
      state: State.CREATED.valueOf(),
      operation: null,
      notification: null,
      confirmation: null,
      items: [this.generateValidRandomItem()],
      updatedAt: now,
      createdAt: now,
    });
  }

  static fromRequest(intentionRequest: IntentionRequest): Intention {
    return Intention.create({
      id: intentionRequest.id,
      requestPaymentId: intentionRequest.paymentId,
      country: intentionRequest.country,
      commerce: intentionRequest.commerce,
      channel: intentionRequest.channel,
      method: intentionRequest.method,
      money: {
        amount: intentionRequest.money.total,
        currency: intentionRequest.money.currency,
        country: intentionRequest.money.country,
      },
      state: State.CREATED.valueOf(),
      operation: null,
      notification: null,
      confirmation: null,
      items: intentionRequest.items.map(item => ({
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }

  static toRequest(intentionScalars: IntentionScalars): IntentionRequest {
    return {
      id: intentionScalars.id,
      paymentId: intentionScalars.requestPaymentId,
      country: intentionScalars.country,
      commerce: intentionScalars.commerce,
      channel: intentionScalars.channel,
      method: intentionScalars.method,
      money: {
        country: intentionScalars.money.country,
        total: intentionScalars.money.amount,
        currency: intentionScalars.money.currency,
      },
      items: intentionScalars.items.map(item => ({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        description: item.description || null,
      })),
    };
  }

  static toOperationRequest(
    intentionScalars: IntentionScalars,
  ): OperationRequest {
    return {
      paymentId: intentionScalars.requestPaymentId,
      total: intentionScalars.money.amount,
      currency: intentionScalars.money.currency,
      intentionId: intentionScalars.id,
      items: intentionScalars.items.map(item => ({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };
  }

  static generateValidRandomMoney() {
    return {
      country: Country.CL.valueOf(),
      currency: Currency.CLP.valueOf(),
      amount: 2000,
    };
  }

  static generateValidRandomItem() {
    return {
      sku: fakerES.commerce.isbn(),
      name: fakerES.commerce.productName(),
      quantity: 1,
      price: 2000,
      total: 2000,
      description: fakerES.commerce.productDescription(),
    };
  }
}
