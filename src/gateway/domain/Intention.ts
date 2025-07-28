import { Channel } from "@gateway/domain/Channel";
import { Commerce } from "@gateway/domain/Commerce";
import { Country } from "@gateway/domain/Country";
import { Money } from "@gateway/domain/Money";
import { PaymentMethod } from "@gateway/domain/PaymentMethod";
import { State } from "@gateway/domain/State";
import { Items } from '@gateway/domain/Items';
import { AggregateRoot } from '@shared/domain/AggregateRoot';
import { Uuid } from '@shared/domain/Uuid';
import { Operation } from '@gateway/domain/Operation';
import { Notification } from '@gateway/domain/Notification';
import { Confirmation } from '@gateway/domain/Confirmation';
import { Currency } from '@gateway/domain/Currency';
import { assertNever } from '@shared/domain/assertNever';
import { CountryAndCurrencyConsistencyError } from '@gateway/domain/CountryAndCurrencyConsistencyError';
import { AmountConsistencyError } from '@gateway/domain/AmountConsistencyError';
import { StateInvalidError } from '@gateway/domain/StateInvalidError';
import { InvalidArgumentError } from '@shared/domain/InvalidArgumentError';

export class Intention extends AggregateRoot {

  private readonly id: Uuid;
  private readonly method: PaymentMethod;
  private readonly channel: Channel;
  private readonly commerce: Commerce;
  private readonly requestPaymentId: string;
  private readonly items: Items;
  private readonly money: Money;
  private readonly country: Country;
  private readonly state: State;
  private readonly operation:Operation | null;
  private readonly notification: Notification | null;
  private readonly confirmation: Confirmation | null;
  private readonly updatedAt: Date;
  private readonly createdAt: Date;

  constructor(
{
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
  }:{
    id: Uuid;
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
}
  ) {
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
    Intention.ensureCountryAndCurrencyConsistency(scalars.money.country, scalars.money.currency);
    Intention.ensureTotalsConsistency(scalars.money.amount, scalars.items);
    Intention.ensureStateValid(scalars.state);
    return this.fromScalars(scalars);
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
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    }
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
      operation: scalar.operation ? Operation.fromScalars(scalar.operation) : null,
      notification: scalar.notification ? Notification.fromScalars(scalar.notification) : null,
      confirmation: scalar.confirmation ? Confirmation.fromScalars(scalar.confirmation) : null,
      updatedAt: new Date(scalar.updatedAt),
      createdAt: new Date(scalar.createdAt),
    });
  }

  static ensureCountryAndCurrencyConsistency(moneyCountry:string, moneyCurrency:string ){
    switch (moneyCountry) {
      case Country.PE.valueOf():
        if (moneyCurrency !== Currency.PEN) {
          throw new CountryAndCurrencyConsistencyError(moneyCurrency, moneyCountry);
        }
        break;
      case Country.CO.valueOf():
        if (moneyCurrency !== Currency.COP) {
          throw new CountryAndCurrencyConsistencyError(moneyCurrency, moneyCountry);
        }
        break;
      case Country.CL.valueOf():
        if (moneyCurrency !== Currency.CLP) {
          throw new CountryAndCurrencyConsistencyError(moneyCurrency, moneyCountry);
        }
        break;
        default:
          assertNever(moneyCountry as never);
    }
  }

  static ensureTotalsConsistency(total: number, items: { quantity:number, price:number, total:number }[]) {
    const itemsTotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    if (total !== itemsTotal) {
      throw new AmountConsistencyError(itemsTotal, total);
    }
  }

  static ensureStateValid(state: string) {
    if (!Object.values(State).includes(state as State)) {
      throw new InvalidArgumentError({message: "Invalid state value: " + state});
    }
    if(state !== State.CREATED.valueOf()) {
      throw new StateInvalidError(State.CREATED.valueOf(), state);
    }
  }
}
export type IntentionScalars = ReturnType<Intention['toScalars']>;

