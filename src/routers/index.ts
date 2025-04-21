import { Router } from "express";
import { UserRouter } from "../Core/API/User/user.router";
import { AdminRouter } from "../Core/API/Admin/admin.router";
import { useAuth } from "../Core/Middlewares/user.middleware";
import { EventRouter } from "../Core/API/Event/event.router";
import { TicketRouter } from "../Core/API/Ticket/ticket.router";
import { adminAuth } from "../Core/Middlewares/admin.middleware";
import { OrderRouter } from "../Core/API/Order/order.router";
import { CartRouter } from "../Core/API/Cart/cart.router";
import { PromoCodeRouter } from "../Core/API/PromoCode/PrCode.router";
import { PaymentRouter } from "../Core/API/Payment/payment.router";

export const v1Router = Router();

v1Router.use('/users' , UserRouter)
v1Router.use('/admin' , AdminRouter)
v1Router.use('/events' , EventRouter , useAuth , adminAuth )
v1Router.use('/tickets' , TicketRouter , useAuth , adminAuth )
v1Router.use('/orders' , OrderRouter , useAuth , adminAuth )
v1Router.use('/carts' , CartRouter , useAuth , adminAuth )
v1Router.use('/promo-code' , PromoCodeRouter , useAuth , adminAuth)
v1Router.use('/payments' , PaymentRouter , useAuth , adminAuth )
