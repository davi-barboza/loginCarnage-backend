import { Request, Response } from "express";

class ProjectController
{
  async homeCarnage(request: Request, response: Response) {
    return response.send({ ok: true, user: request.userId });
  }
}

export { ProjectController };