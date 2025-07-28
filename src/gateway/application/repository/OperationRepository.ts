import { OperationRequest } from '@gateway/application/repository/OperationRequest';
import { OperationResponse } from '@gateway/application/repository/OperationResponse';

export interface OperationRepository {
  create(operationRequest: OperationRequest):Promise<OperationResponse>
}
