import { Router } from "express";
import { PromocodeController } from "./PrCode.controller";


export const PromoCodeRouter = Router();
const controller = PromocodeController;

PromoCodeRouter.post("/create-Code" , controller.createPromoCode)
PromoCodeRouter.post("/apply-Code" , controller.applyPromoCode)