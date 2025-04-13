import { Router } from "express";
import { PromoCodeController } from "./PrCode.controller";

export const PromoCodeRouter = Router();
const controller = PromoCodeController;

PromoCodeRouter.post("/create-Code" , controller.createPromoCode)