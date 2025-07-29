import { POST, route } from 'awilix-express';
import { type Request, type Response } from 'express';

import { Controller } from '@apps/controllers/Controller';
import { CreateIntentionRequestFactory } from '@apps/controllers/CreateIntentionRequestFactory';

import { DomainError } from '@shared/domain/DomainError';

import { IntentionCreator } from '@gateway/application/IntentionCreator';

@route('/intention')
export default class CreateIntentionController implements Controller {
  private readonly intentionCreator: IntentionCreator;

  constructor({ intentionCreator }: { intentionCreator: IntentionCreator }) {
    this.intentionCreator = intentionCreator;
  }

  @POST()
  async run(req: Request, res: Response): Promise<void> {
    try {
      const request = CreateIntentionRequestFactory.create(req);
      await this.intentionCreator.execute(request);
      res.status(201).json({ message: 'Intention created' });
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof DomainError) {
        switch (error.type) {
          case 'InvalidArgumentError':
            res.status(400).json({ error: error.message });
            break;
          case 'IntentionNotExistError':
            res.status(404).json({ error: error.message });
            break;
          default:
            res.status(500).json({ error: 'Internal Server Error' });
        }
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
