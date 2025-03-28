import { Router } from "express";
import { AdminController } from "./admin.controller";
import { useAuth } from "../../Middlewares/user.middleware";
import { adminAuth } from "../../Middlewares/admin.middleware";

export const AdminRouter = Router();
const controller = AdminController;

AdminRouter.post('/create' , useAuth , adminAuth , controller.userCreateAdmin)
AdminRouter.get('/list' , useAuth , adminAuth , controller.UserList)
AdminRouter.put('/update/:id' , useAuth , adminAuth , controller.userEdit)
AdminRouter.delete('/delete/:id' , useAuth , adminAuth , controller.userDelete)