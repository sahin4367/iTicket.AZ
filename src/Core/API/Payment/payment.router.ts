import { Router } from "express";
import { PaymentController } from "./payment.controller";


export const PaymentRouter = Router();  
const controller = PaymentController;

PaymentRouter.post("/create-fake-payment", controller.createTestPayment);
PaymentRouter.get("/fake-payment/:paymentId", controller.showTestPaymentPage);
PaymentRouter.post("/complete-fake-payment/:paymentId", controller.completeTestPayment);
PaymentRouter.post('/create-payment', controller.createPayment);
