import { Router } from "express";
import { UserRouter } from "../Core/API/User/user.router";
import { AdminRouter } from "../Core/API/Admin/admin.router";
import { useAuth } from "../Core/Middlewares/user.middleware";
import { EventRouter } from "../Core/API/Event/event.router";
import { TicketRouter } from "../Core/API/Ticket/ticket.router";
import { adminAuth } from "../Core/Middlewares/admin.middleware";

export const v1Router = Router();

v1Router.use('/users' , UserRouter)
v1Router.use('/admin' , AdminRouter)
v1Router.use('/events' , EventRouter)
v1Router.use('/tickets' , TicketRouter , useAuth , adminAuth )

