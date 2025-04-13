import { Request,Response,NextFunction } from "express";
import { CreatePromoCodeDTO } from "../../app/enums";


const createPromoCode = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {code,discountPercentage,expiresAt,userLimit = 0} : CreatePromoCodeDTO = req.body;
        if (!code || !discountPercentage || !expiresAt) {
            res.status(400).json({
                message : `Please provide all required fields~!`
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            message : `An occureed errors`
        });
        next(error);
    }
}

export const PromoCodeController = {
    createPromoCode
}


































