import { Router } from "express";
import { CartController } from "./cart.controller";

export const CartRouter = Router();
const controller = CartController;

CartRouter.post('/add' , controller.addToCart);
CartRouter.get('/list' , controller.getCart);
CartRouter.delete('/remove/:id' , controller.removeFromCart);