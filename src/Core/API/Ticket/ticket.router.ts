import { Router } from "express";
import { TicketController } from "./ticket.controller";

export const TicketRouter = Router();
const controller = TicketController;

TicketRouter.post('/create' , controller.createTicket)

