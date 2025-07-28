import { Controller } from "@apps/controllers/Controller";
import { POST, route } from "awilix-express";
import { type Request, type Response } from "express";

@route('/intention')
export default class CreateIntentionController implements Controller {

  @POST()
  async run(req: Request, res: Response):Promise<void> {}
    
}
