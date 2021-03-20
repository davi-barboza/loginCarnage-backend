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
router.get("/users", userController.show);

router.post("/auth", authController.authenticate);
router.post("/forgot_password", authController.forgotPassword);
router.post("/reset_password", authController.resetPassword);

router.get("/projects", authMiddleware, projectController.index);


export { router };