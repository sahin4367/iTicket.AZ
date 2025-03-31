import { Router } from "express";
import { TicketController } from "./ticket.controller";

export const TicketRouter = Router();
const controller = TicketController;

TicketRouter.post('/create' , controller.createTicket)
TicketRouter.get('/list' , controller.getListTicket)
TicketRouter.get('/list/:id' , controller.getTicketByID)
TicketRouter.put('/update/:id' , controller.updateTicket)
TicketRouter.put('/delete/:id' , controller.softDeleteTicket)