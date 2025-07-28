import { Controller } from "@apps/controllers/Controller";
import { POST, route } from "awilix-express";
import { type Request, type Response } from "express";

@route('/confirmation')
export default class CreateConfirmationController implements Controller {

  @POST()
  async run(req: Request, res: Response):Promise<void> {}
    
}
