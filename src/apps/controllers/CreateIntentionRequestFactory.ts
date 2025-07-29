import { CreateIntentionRequestMapper } from '@apps/controllers/CreateIntentionRequestMapper';
import { Request } from 'express';
import { IntentionRequest } from '@gateway/application/IntentionRequest';

export class CreateIntentionRequestFactory {
  static create(request: Request): IntentionRequest {
    if (
      request.body &&
      request.body.formFields &&
      request.body.formFields.jwt
    ) {
      return CreateIntentionRequestMapper.tgrMapper(
        request.body.formFields.jwt,
      );
    }
    throw new Error(
      `Cannot create CreateIntentionRequest from the provided request: ${JSON.stringify(request.body)}`,
    );
  }
}
