import { Router } from "express";
import authMiddleware from '../app/middlewares/authMiddleware';
import { AuthController } from "../app/controllers/AuthController";
import { UserController } from "../app/controllers/UserController";
import { ProjectController } from "../app/controllers/ProjectController";

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const projectController = new ProjectController();

router.post("/users", userController.create);

router.post("/auth", authController.authenticate);

router.get("/projects", authMiddleware, projectController.index);

export { router };