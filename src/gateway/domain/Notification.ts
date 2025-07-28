export class Notification {
  private readonly state: string;
  private readonly createdAt: Date;

  constructor(
    { state, createdAt }: {
      state: string;
      createdAt: Date;
    }
  ) {
    this.state = state;
    this.createdAt = createdAt;
  }

  toScalars() {
    return {
      state: this.state,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromScalars(scalars: { state: string; createdAt: string }): Notification {
    return new Notification({
      state: scalars.state,
      createdAt: new Date(scalars.createdAt),
    });
  }
}
