import { fakerES } from '@faker-js/faker';

import { OperationRepository } from '@gateway/application/repository/OperationRepository';
import { OperationRequest } from '@gateway/application/repository/OperationRequest';
import { OperationResponse } from '@gateway/application/repository/OperationResponse';

export class OperationRepositoryMock implements OperationRepository {
  private mockCreate = jest.fn();
  private operationRequest: OperationRequest | null = null;
  private operationResponse: OperationResponse | null = null;

  async create(request: OperationRequest): Promise<OperationResponse> {
    this.mockCreate(request);
    expect(this.mockCreate).toHaveBeenCalledWith(request);
    this.operationRequest = request;
    this.operationResponse = {
      operationId: fakerES.database.mongodbObjectId().valueOf(),
      callbackUrl: fakerES.internet.url(),
      intentionId: request.intentionId,
      requestPaymentId: request.paymentId,
    };

    return this.operationResponse;
  }

  shouldCreate(operationRequest: OperationRequest): void {
    this.mockCreate(operationRequest);
  }
}
