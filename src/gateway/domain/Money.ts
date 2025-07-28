export class Money {
  private readonly amount: number;
  private readonly currency: string;
  private readonly country: string;

  constructor({ amount, currency,  country }: {
    amount: number;
    currency: string;
    country: string;
  }) {
    this.amount = amount;
    this.currency = currency;
    this.country = country;
  }

  toScalars() {
    return {
      amount: this.amount,
      currency: this.currency,
      country: this.country,
    };
  }

  static fromScalars(scalars: MoneyScalars): Money {
    return new Money({ ...scalars });
  }

}

 export type MoneyScalars = ReturnType<Money['toScalars']>;
