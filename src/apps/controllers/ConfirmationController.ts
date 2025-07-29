import { POST, route } from 'awilix-express';
import type { Request, Response } from 'express';

import { ConfirmationRequestMapper } from '@apps/controllers/ConfirmationRequestMapper';
import { Controller } from '@apps/controllers/Controller';

import { ConfirmationCreator } from '@gateway/application/ConfirmationCreator';

@route('/confirmation')
export class ConfirmationController implements Controller {
  private readonly confirmationCreator: ConfirmationCreator;

  constructor({
    confirmationCreator,
  }: {
    confirmationCreator: ConfirmationCreator;
  }) {
    this.confirmationCreator = confirmationCreator;
  }

  @POST()
  async run(req: Request, res: Response): Promise<void> {
    try {
      const request = ConfirmationRequestMapper.pspMapper(req.body);
      await this.confirmationCreator.execute(request);
      res.status(201).json({ message: 'Confirmation created' });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}
