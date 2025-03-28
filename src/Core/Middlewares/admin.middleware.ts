import { Response, NextFunction } from 'express';
import { CustomRequest } from "../../type/custome-request";
import { EUsesrRole } from '../app/enums';

export const adminAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            message: `Login is required~!`
        });
        return;
    }

    if (req.user.role !== EUsesrRole.ADMIN) {
        res.status(403).json({
            message: `You don't have permission~!`
        });
        return;
    }
    next();
};
