import { Router } from "express";
import { UserController } from "./user.controller";

export const UserRouter = Router();
const controller = UserController;

UserRouter.post('/register' , controller.register);
UserRouter.post('/login' , controller.login);