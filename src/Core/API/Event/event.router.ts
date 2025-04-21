import { Router } from "express";
import { EventController } from "./event.controller";

export const EventRouter = Router();
const controller = EventController;

EventRouter.post('/create' , controller.createEvent);
EventRouter.get('/list' , controller.getListEvents);
EventRouter.get('/list/:id' , controller.getEventById);
EventRouter.put('/update/:id' , controller.updatedEvent);
EventRouter.put('/delete/:id' , controller.softDeleteEvent);