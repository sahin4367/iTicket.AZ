import { Request,Response,NextFunction } from "express";
import { CreateTicketDTO } from "./ticket.dto";
import { validate } from "class-validator";
import { Ticket } from "../../../DAL/models/ticket.model";
import { v4 as uuidv4 } from "uuid"


const createTicket = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {name,price,type,status} = req.body;
        if (!name || !price || !type || !status) {
            res.status(400).json({
                message : `Pliase , all filds required~!`
            });
            return;
        }

        const dto = new CreateTicketDTO();
        dto.name = name;
        dto.price = price;
        dto.type = type;
        dto.status = status;

        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(err => err.constraints) });
            return;
        }

        const newTicket = Ticket.create({
            name,
            price,
            type,
            status,
            qrCode: uuidv4()
        });
        await newTicket.save();
        res.status(201).json({
            message : `Ticket created successfully~!`,
            ticket : newTicket
        });
        return;
    } catch (error) {
        res.status(500).json({
            message : `Interval errors`
        });
        next(error);
    }
}

export const TicketController = {
    createTicket,
}