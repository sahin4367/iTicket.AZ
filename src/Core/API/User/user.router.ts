import { Router } from "express";
import { UserController } from "./user.controller";
import { useAuth } from "../../Middlewares/user.middleware";

export const UserRouter = Router();
const controller = UserController;

UserRouter.post('/register' , controller.register);
UserRouter.post('/login' , controller.login);
UserRouter.post('/verify-email' , useAuth, controller.verifyEmail);
UserRouter.post('/check-verify-code' , useAuth, controller.checkVerifyCode);