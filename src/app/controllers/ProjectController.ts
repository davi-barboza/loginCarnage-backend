import { Request, Response } from "express";

class ProjectController
{
  async index(request: Request, response: Response) {
    return response.send({ ok: true, user: request.userId });
  }
}

export { ProjectController };