import { Router } from "express";
import { PaymentController } from "./payment.controller";

export const PaymentRouter = Router();  
const controller = PaymentController;

// PaymentRouter.post('/create' , controller.createPayment);
PaymentRouter.post('/create' , controller.fakePaymentSuccess);
PaymentRouter.post('/success' , controller.executePayment);
PaymentRouter.post('/cancel' , controller.cancelPayment);