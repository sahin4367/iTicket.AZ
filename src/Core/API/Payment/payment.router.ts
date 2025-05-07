import { Router } from "express";
import { PaymentController } from "./payment.controller";

export const PaymentRouter = Router();  
const controller = PaymentController;

// PaymentRouter.post('/create' , controller.createPayment);
// PaymentRouter.post('/create' , controller.fakeCreatePayment);
// PaymentRouter.get('/success' , controller.fakeApprovalPage);
PaymentRouter.post('/cancel' , controller.cancelPayment);