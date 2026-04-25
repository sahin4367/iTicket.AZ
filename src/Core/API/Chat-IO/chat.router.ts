import { Router } from "express";
import { chatController } from "./chat.controller";
import { useAuth } from "../../Middlewares/user.middleware";
import { adminAuth } from "../../Middlewares/admin.middleware";

export const ChatRouter = Router();
const controller = chatController;

ChatRouter.post('/messages', useAuth, adminAuth, chatController.createMessage);
ChatRouter.get('/all-messages' , useAuth , adminAuth , chatController.getAllMessages);