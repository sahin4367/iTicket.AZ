import { Request,Response,NextFunction } from "express";
import { Cart } from "../../../DAL/models/cart.model";
import { Ticket } from "../../../DAL/models/ticket.model";
import { CartTicket } from "../../../DAL/models/Cart-Ticket.model";


const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, ticketId, quantity } = req.body;

        let cart = await Cart.findOne({
            where: { user: { id: userId } },
            relations: ["user", "cartTickets"],
            select: {
                user: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                }
            }
        });

        if (!cart) {
            cart = Cart.create({
                user: { id: userId },
                totalPrice: 0
            });
            await cart.save();
        }

        const ticket = await Ticket.findOne({ where: { id: ticketId } });
        if (!ticket) {
            res.status(404).json({ message: `Ticket with id ${ticketId} not found!` });
            return;
        }

        const reservationExpiresAt = new Date(Date.now() + 15 * 60 * 1000); 

        const cartTicket = CartTicket.create({
            cart,
            ticket,
            quantity,
            reservedAt: new Date(),
            reservationExpiresAt
        });
        await cartTicket.save();

        cart.totalPrice += ticket.price * quantity;
        await cart.save();

        res.status(201).json({
            message: `Ticket with id ${ticketId} added to cart successfully!`,
            cart
        });
    } catch (error) {
        res.status(500).json({ message: `Error adding ticket to cart: ${error}` });
        next(error);
    }
};

const getCart = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const cart = await CartTicket.find({
            relations : ["cart" , "ticket"],
        });
        if (!cart) {
            res.status(404).json({
                message : `Cart not found~!`
            });
            return;
        }

        res.status(200).json({
            message : `Cart retrieved successfully~!`,
            cart : cart,
        })
    } catch (error) {
        res.status(500).json({
            message : `Error retrieving cart: ${error}`,
        });
        next(error);
    }
}


export const CartController = {
    addToCart,
    getCart,
}