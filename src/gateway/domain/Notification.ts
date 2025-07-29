import { NotificationState } from '@gateway/domain/NotificationState';

export class Notification {
  private readonly state: NotificationState;
  private readonly createdAt: Date;

  constructor({
    state,
    createdAt,
  }: {
    state: NotificationState;
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
  }): Notification {
    return new Notification({
      state: NotificationState[scalars.state as keyof typeof NotificationState],
      createdAt: scalars.createdAt,
    });
  }
}
