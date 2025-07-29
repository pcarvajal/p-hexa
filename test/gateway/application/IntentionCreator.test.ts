import { IntentionCreator } from '@gateway/application/IntentionCreator';
import { IntentionId } from '@gateway/domain/IntentionId';

import { IntentionMother } from '../domain/IntentionMother';
import { IntentionRepositoryMock } from '../domain/IntentionRepositoryMock';
import { OperationRepositoryMock } from './repository/OperationRepositoryMock';

beforeEach(() => {
  jest.useFakeTimers({ now: new Date() });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Intention Creator', () => {
  const intentionRepository = new IntentionRepositoryMock();
  const operationRepository = new OperationRepositoryMock();
  const intentionCreator = new IntentionCreator({
    intentionRepository,
    operationRepository,
  });
  describe('#execute', () => {
    it('should create new intention', async () => {
      const intention = IntentionMother.random();
      const scalars = intention.toScalars();

      intentionRepository.shouldSearchByIdAndCommerce(
        scalars.requestPaymentId,
        scalars.commerce,
      );
      intentionRepository.shouldSave(intention);
      intentionRepository.shouldSearchById(
        new IntentionId({ value: intention.idValue }),
      );
      operationRepository.shouldCreate(
        IntentionMother.toOperationRequest(scalars),
      );
      const request = IntentionMother.toRequest(scalars);
      await intentionCreator.execute(request);
    });
  });
});
