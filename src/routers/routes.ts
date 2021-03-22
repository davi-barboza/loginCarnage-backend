import { Router } from "express";
import authMiddleware from '../app/middlewares/authMiddleware';
import { AuthController } from "../app/controllers/AuthController";
import { UserController } from "../app/controllers/UserController";
import { ProjectController } from "../app/controllers/ProjectController";

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const projectController = new ProjectController();

router.post("/api/users", userController.create);
router.get("/api/users", userController.show);

router.post("/api/auth", authController.authenticate);
router.post("/api/forgot_password", authController.forgotPassword);
router.post("/api/reset_password", authController.resetPassword);

router.get("/api/projects", authMiddleware, projectController.homeCarnage);


export { router };