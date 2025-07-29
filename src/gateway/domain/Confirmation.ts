import { ConfirmationState } from '@gateway/domain/ConfirmationState';

export class Confirmation {
  private readonly state: ConfirmationState;
  private readonly createdAt: Date;

  constructor({
    state,
    createdAt,
  }: {
    state: ConfirmationState;
    createdAt: Date;
  }) {
    this.state = state;
    this.createdAt = createdAt;
  }

  toScalars() {
    return { state: this.state, createdAt: this.createdAt };
  }

  static fromScalars(scalars: {
    state: string;
    createdAt: Date;
  }): Confirmation {
    return new Confirmation({
      state: ConfirmationState[scalars.state as keyof typeof ConfirmationState],
      createdAt: scalars.createdAt,
    });
  }
}
