import { AggregateRoot } from '@shared/domain/AggregateRoot';
import { assertNever } from '@shared/domain/assertNever';
import { InvalidArgumentError } from '@shared/domain/InvalidArgumentError';
import { Uuid } from '@shared/domain/Uuid';

import { AmountConsistencyError } from '@gateway/domain/AmountConsistencyError';
import { Channel } from '@gateway/domain/Channel';
import { Commerce } from '@gateway/domain/Commerce';
import { Confirmation } from '@gateway/domain/Confirmation';
import { Country } from '@gateway/domain/Country';
import { CountryAndCurrencyConsistencyError } from '@gateway/domain/CountryAndCurrencyConsistencyError';
import { Currency } from '@gateway/domain/Currency';
import { IntentionId } from '@gateway/domain/IntentionId';
import { Items } from '@gateway/domain/Items';
import { Money } from '@gateway/domain/Money';
import { Notification } from '@gateway/domain/Notification';
import { Operation } from '@gateway/domain/Operation';
import { PaymentMethod } from '@gateway/domain/PaymentMethod';
import { State } from '@gateway/domain/State';
import { StateInvalidError } from '@gateway/domain/StateInvalidError';

export class Intention extends AggregateRoot {
  private readonly id: IntentionId;
  private readonly method: PaymentMethod;
  private readonly channel: Channel;
  private readonly commerce: Commerce;
  private readonly requestPaymentId: string;
  private readonly items: Items;
  private readonly money: Money;
  private readonly country: Country;
  private readonly state: State;
  private operation: Operation | null;
  private notification: Notification | null;
  private confirmation: Confirmation | null;
  private readonly updatedAt: Date;
  private readonly createdAt: Date;

  constructor({
    id,
    method,
    channel,
    commerce,
    requestPaymentId,
    items,
    money,
    country,
    state,
    operation,
    notification,
    confirmation,
    updatedAt,
    createdAt,
  }: {
    id: IntentionId;
    method: PaymentMethod;
    channel: Channel;
    commerce: Commerce;
    requestPaymentId: string;
    items: Items;
    money: Money;
    country: Country;
    state: State;
    operation: Operation | null;
    notification: Notification | null;
    confirmation: Confirmation | null;
    updatedAt: Date;
    createdAt: Date;
  }) {
    super();
    this.id = id;
    this.method = method;
    this.channel = channel;
    this.commerce = commerce;
    this.requestPaymentId = requestPaymentId;
    this.items = items;
    this.money = money;
    this.country = country;
    this.state = state;
    this.operation = operation;
    this.notification = notification;
    this.confirmation = confirmation;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }

  static create(scalars: IntentionScalars) {
    Intention.ensureCountryAndCurrencyConsistency(
      scalars.money.country,
      scalars.money.currency,
    );
    Intention.ensureTotalsConsistency(scalars.money.amount, scalars.items);
    Intention.ensureStateValid(scalars.state);

    if (scalars.operation) {
      throw new InvalidArgumentError({
        message: 'Operation is not allowed to be created',
      });
    }

    if (scalars.notification) {
      throw new InvalidArgumentError({
        message: 'Notification is not allowed to be created',
      });
    }

    if (scalars.confirmation) {
      throw new InvalidArgumentError({
        message: 'Confirmation is not allowed to be created',
      });
    }

    return this.fromScalars(scalars);
    //Domain Event Record Create Intention
  }

  toScalars() {
    return {
      id: this.id.toString(),
      method: this.method.toString(),
      channel: this.channel.toString(),
      commerce: this.commerce.toString(),
      requestPaymentId: this.requestPaymentId,
      items: this.items.toScalars(),
      money: this.money.toScalars(),
      country: this.country.toString(),
      state: this.state.toString(),
      operation: this.operation ? this.operation.toScalars() : null,
      notification: this.notification ? this.notification.toScalars() : null,
      confirmation: this.confirmation ? this.confirmation.toScalars() : null,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }

  get idValue() {
    return this.id.value;
  }

  set operationValue({
    pspId,
    callbackUrl,
    createdAt,
  }: {
    pspId: string;
    callbackUrl: string;
    createdAt: Date;
  }) {
    this.operation = Operation.fromScalars({ pspId, callbackUrl, createdAt });
  }

  set notificationValue({
    state,
    createdAt,
  }: {
    state: string;
    createdAt: Date;
  }) {
    this.notification = Notification.fromScalars({ state, createdAt });
  }

  set confirmationValue({
    state,
    createdAt,
  }: {
    state: string;
    createdAt: Date;
  }) {
    this.confirmation = Confirmation.fromScalars({ state, createdAt });
  }

  static fromScalars(scalar: IntentionScalars) {
    return new Intention({
      id: new Uuid({ value: scalar.id }),
      method: PaymentMethod[scalar.method as keyof typeof PaymentMethod],
      channel: Channel[scalar.channel as keyof typeof Channel],
      commerce: Commerce[scalar.commerce as keyof typeof Commerce],
      requestPaymentId: scalar.requestPaymentId,
      items: Items.fromScalars(scalar.items),
      money: Money.fromScalars(scalar.money),
      country: Country[scalar.country as keyof typeof Country],
      state: State[scalar.state as keyof typeof State],
      operation: scalar.operation
        ? Operation.fromScalars(scalar.operation)
        : null,
      notification: scalar.notification
        ? Notification.fromScalars(scalar.notification)
        : null,
      confirmation: scalar.confirmation
        ? Confirmation.fromScalars(scalar.confirmation)
        : null,
      updatedAt: new Date(scalar.updatedAt),
      createdAt: new Date(scalar.createdAt),
    });
  }

  static ensureCountryAndCurrencyConsistency(
    moneyCountry: string,
    moneyCurrency: string,
  ) {
    switch (moneyCountry) {
      case Country.PE.valueOf():
        if (moneyCurrency !== Currency.PEN) {
          throw new CountryAndCurrencyConsistencyError(
            moneyCurrency,
            moneyCountry,
          );
        }
        break;
      case Country.CO.valueOf():
        if (moneyCurrency !== Currency.COP) {
          throw new CountryAndCurrencyConsistencyError(
            moneyCurrency,
            moneyCountry,
          );
        }
        break;
      case Country.CL.valueOf():
        if (moneyCurrency !== Currency.CLP) {
          throw new CountryAndCurrencyConsistencyError(
            moneyCurrency,
            moneyCountry,
          );
        }
        break;
      default:
        assertNever(moneyCountry as never);
    }
  }

  static ensureTotalsConsistency(
    total: number,
    items: { quantity: number; price: number; total: number }[],
  ) {
    const itemsTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );
    if (total !== itemsTotal) {
      throw new AmountConsistencyError(itemsTotal, total);
    }
  }

  static ensureStateValid(state: string) {
    if (!Object.values(State).includes(state as State)) {
      throw new InvalidArgumentError({
        message: 'Invalid state value: ' + state,
      });
    }
    if (state !== State.CREATED.valueOf()) {
      throw new StateInvalidError(State.CREATED.valueOf(), state);
    }
  }
}
export type IntentionScalars = ReturnType<Intention['toScalars']>;
