import { Router } from "express";
import { OrderController } from "./order.controller";

export const OrderRouter = Router();
const controller = OrderController;

OrderRouter.post('/create' , controller.createOrder)
OrderRouter.get('/list' , controller.getListOrder)
OrderRouter.get('/list/:id' , controller.getOrderById)
OrderRouter.put('/delete/:id' , controller.softDeleteOrder)
