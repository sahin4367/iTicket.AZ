import { Router } from "express";
import { PaymentController } from "./payment.controller";

export const PaymentRouter = Router();
const controller = PaymentController;

