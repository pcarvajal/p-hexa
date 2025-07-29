export class Operation{
 private readonly pspId: string;
  private readonly callbackUrl: string;
  private readonly createdAt: Date;

  constructor({ pspId, callbackUrl,createdAt }:{pspId: string; callbackUrl: string; createdAt: Date}) {
    this.pspId = pspId;
    this.callbackUrl = callbackUrl;
    this.createdAt = createdAt;
  }

  toScalars() {
    return {
      pspId: this.pspId,
      callbackUrl: this.callbackUrl,
      createdAt: this.createdAt,
    };
  }

  static fromScalars(scalars: { pspId: string; callbackUrl: string; createdAt: Date }): Operation {
    return new Operation({
      pspId: scalars.pspId,
      callbackUrl: scalars.callbackUrl,
      createdAt: scalars.createdAt,
    });
  }
}
