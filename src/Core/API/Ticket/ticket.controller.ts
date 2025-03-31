import { Request,Response,NextFunction } from "express";
import { TicketDTO } from "./ticket.dto";
import { validate } from "class-validator";
import { Ticket } from "../../../DAL/models/ticket.model";
import { v4 as uuidv4 } from "uuid"
import { User } from "../../../DAL/models/user.model";
import { Event } from "../../../DAL/models/event.model";


const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, price, type, status, user_id, event_id } = req.body;

        if (!name || !price || !type || !status || !user_id || !event_id) {
            res.status(400).json({
                message: "Please, all fields are required!",
            });
            return;
        }

        const user = await User.findOne({ 
            where: { id: user_id },
            select : {
                id : true,
                name : true,
                surname : true,
                phone : true,
                role : true,
                email : true,
                createdAt  :true,
                updatedAt : true,
                deletedAt : true
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found~!" });
            return;
        }

        const event = await Event.findOne({ 
            where: { id: event_id } 
        }
        );
        if (!event) {
            res.status(404).json({ message: "Event not found~!" });
            return;
        }

        const dto = new TicketDTO();
        dto.name = name;
        dto.price = price;
        dto.type = type;
        dto.status = status;
        dto.user_id = user_id;
        dto.event_id = event_id;

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
            user,
            event,
            qrCode: uuidv4(),
        });

        await newTicket.save();

        res.status(201).json({
            message: "Ticket created successfully~!",
            ticket: newTicket,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Internal server error~!",
        });
        next(error);
    }
};

const getListTicket = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const tickets = await Ticket.find({
            relations : ["user","event"],
            select : {
                user : {
                    id:true,
                    email : true,
                    createdAt : true,
                    updatedAt : true,
                    deletedAt : true
                },
                event : {
                    id : true,
                    availableTickets : true,
                    date : true,
                    createdAt : true,
                    updatedAt : true,
                    deletedAt : true,
                }
            }
        });
        if (tickets.length === 0) {
            res.status(404).json({
                message: "No tickets found!",
            });
            return;
        }


        res.status(200).json({
            message : `Tickets retrieved successfully~!`,
            tickets
        })
    } catch (error) {
        res.status(500).json({
            message : `An occured errors~!`
        });
        next(error);
    }
}

const getTicketByID = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const ticketID = Number(req.params.id);
        const ticket = await Ticket.findOne({
            where : {id : ticketID},
            relations : ["user","event"],
            select : {
                user : {
                    id : true,
                    email : true,
                    role : true,
                    createdAt : true,
                    updatedAt : true,
                    deletedAt : true
                },
                event : {
                    id : true,
                    availableTickets : true,
                    title : true,
                    date : true,
                    createdAt : true,
                    updatedAt  :true,
                    deletedAt : true
                }
            }
        });

        if (!ticket) {
            res.status(404).json({
                message : `Ticket not found~!`
            });
            return;
        }

        res.status(200).json({
            message : `Ticket this ID :`,
            ticket
        })
    } catch (error) {
        res.status(500).json({
            message : `An ocoured error~!`
        });
        next(error);
    }
}

const updateTicket = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const ticketID = Number(req.params.id);
        const updateData : TicketDTO = req.body;

        const ticket = await Ticket.findOne({
            where : { id : ticketID }, 
        });
        if (!ticket) {
            res.status(404).json({
                message : `Ticket not found~!`
            });
            return;
        }

        Object.assign(ticket,updateData);

        const UpdatedTicket = await ticket.save();
        res.status(200).json({
            message : `Ticket updated saccessfully~!`,
            ticket : {
                name : UpdatedTicket.name,
                price : UpdatedTicket.price,
                type  :UpdatedTicket.type,
                status : UpdatedTicket.status,
                user_id : UpdatedTicket.user,
                event_id : UpdatedTicket.event
            }
        })
    } catch (error) {
        res.status(500).json({
            message : `An occured errors~!`
        });
        return;
    }
}

const softDeleteTicket = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const ticketId = Number(req.params.id);
        const ticket = await Ticket.findOne({
            where : {
                id : ticketId
            },
        });
        if (!ticket) {
            res.status(404).json({ 
                message: "Ticket not found~!" 
            });
            return;
        }

        const deletedEvent = await Ticket.update(ticketId , {
            isDeleted : true,
            deletedAt :  new Date()
        });
        res.status(200).json({
            message : `Ticket deleted successfully~!`,
            ticket : deletedEvent
        });
        return;
    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error);
    }
}

export const TicketController = {
    createTicket,
    getListTicket,
    getTicketByID,
    updateTicket,
    softDeleteTicket

}