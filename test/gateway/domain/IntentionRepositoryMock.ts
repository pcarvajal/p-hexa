import { Nullable } from '@shared/domain/nullable';

import { Intention } from '@gateway/domain/Intention';
import { IntentionId } from '@gateway/domain/IntentionId';
import { IntentionRepository } from '@gateway/domain/IntentionRepository';

export class IntentionRepositoryMock implements IntentionRepository {
  private mockSave = jest.fn();
  private intentionMock: Nullable<Intention> = null;
  private searchByIdMock = jest.fn();
  private searchByPaymentIdAndCommerceMock = jest.fn();
  private update = false;

  async findById(id: IntentionId): Promise<Nullable<Intention>> {
    expect(this.searchByIdMock).toHaveBeenCalledWith(id);
    return this.searchByIdMock(id);
  }

  async findByPaymentIdAndCommerce(
    requestPaymentId: string,
    commerce: string,
  ): Promise<Nullable<Intention>> {
    expect(this.searchByPaymentIdAndCommerceMock).toHaveBeenCalledWith(
      requestPaymentId,
      commerce,
    );
    return this.searchByPaymentIdAndCommerceMock(requestPaymentId, commerce);
  }

  async save(intention: Intention): Promise<void> {
    if (!this.update) {
      expect(this.mockSave).toHaveBeenCalledWith(intention.toScalars());
      this.update = true;
    } else expect(this.mockSave).toHaveBeenCalled();
    return Promise.resolve();
  }

  shouldSave(intention: Intention): void {
    this.mockSave(intention.toScalars());
    this.intentionMock = intention;
  }

  shouldSearchByIdAndCommerce(paymentId: string, commerce: string) {
    this.searchByPaymentIdAndCommerceMock(paymentId, commerce);
    this.searchByPaymentIdAndCommerceMock.mockReturnValueOnce(null);
  }

  shouldSearchById(intentionId: IntentionId) {
    this.searchByIdMock(intentionId);
    this.searchByIdMock.mockReturnValueOnce(this.intentionMock);
  }
}
