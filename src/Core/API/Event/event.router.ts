import { Router } from "express";
import { EventController } from "./event.controller";
import { useAuth } from "../../Middlewares/user.middleware";
import { adminAuth } from "../../Middlewares/admin.middleware";

export const EventRouter = Router();
const controller = EventController;

EventRouter.post('/create' , useAuth , adminAuth , controller.createEvent);
EventRouter.get('/list' , useAuth , adminAuth , controller.getListEvents);
EventRouter.get('/list/:id' , useAuth , adminAuth , controller.getListEvents);
EventRouter.put('/update/:id' , useAuth , adminAuth , controller.updatedEvent);
EventRouter.put('/delete/:id' , useAuth , adminAuth , controller.softDeleteEvent);