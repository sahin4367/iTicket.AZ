import { Request,Response,NextFunction } from "express";
import { CreateOrderDTO, UpdateOrderDTO } from "./order.dto";
import { EOrderStatus } from "../../app/enums";
import { Order } from "../../../DAL/models/order.model";
import { Cart } from "../../../DAL/models/cart.model";


const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({
            where: { user: { id: userId } },
            relations: ["cartTickets", "cartTickets.ticket"]
        });

        if (!cart || cart.cartTickets.length === 0) {
            res.status(400).json({ message: "Cart is empty!" });
            return;
        }

        const now = new Date();
        const validCartTickets = cart.cartTickets.filter(cartTicket => 
            new Date(cartTicket.reservationExpiresAt).getTime() > now.getTime()
        );

        if (validCartTickets.length === 0) {
            res.status(400).json({ message: "All reservations have expired!" });
            return;
        }

        const totalPrice = validCartTickets.reduce(
            (sum, cartTicket) => sum + (cartTicket.ticket.price * cartTicket.quantity),
            0
        );

        const newOrder = Order.create({
            user: { id: userId },
            cart,
            status: EOrderStatus.PENDING,
            quantity: validCartTickets.reduce((sum, cartTicket) => sum + cartTicket.quantity, 0),
            totalPrice
        });
        await newOrder.save();

        for (const cartTicket of validCartTickets) {
            await cartTicket.remove();
        }

        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: "Order created successfully!",
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error}` });
        next(error);
    }
};

const getListOrder = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const orders = await Order.find({
            relations : ["user","promoCode"] , //payment
            select : {
                user : {
                    id : true,
                    email : true,
                    role : true,
                    createdAt : true,
                    updatedAt : true,
                    deletedAt : true,
                }
            }
        })

        if (!orders) {
            res.status(404).json({
                message : `Orders not found~!`
            });
            return;
        }

        res.status(200).json({
            message : `List order-!`,
            orders
        })
    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error);
    }
}

const getOrderById = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const orderID = Number(req.params.id);
        
        const order = await Order.findOne({
            where : {id : orderID},
            relations : ["user","promoCode"],
            select : {
                user  : {
                    id :true,
                    email : true,
                    role : true,
                    createdAt :true,
                    updatedAt : true,
                    deletedAt :true,
                }
            }
        })

        res.status(200).json({
            message  :`Order -ID list!`,
            order
        })
    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error);
    }
}

const updateOrder = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const orderId = Number(req.params.id);
        const UpdateData : UpdateOrderDTO = req.body;

        const order = await Order.findOne({
            where : {id : orderId},
            select : {
                user : {
                    id : true,
                    email : true,
                    role : true,
                    createdAt : true,
                    updatedAt : true,
                    deletedAt : true
                }
            }
        });
        if (!order) {
            res.status(404).json({
                message : `Order not found~!`
            });
            return;
        }

        Object.assign(order,UpdateData);

        const UpdatedOrder = await order.save();
        res.status(200).json({
            message : `Order updated successfuly~!`,
            order : {
                user_id : UpdatedOrder.user,
                // ticket_id : UpdatedOrder.ticket,
                quantity : UpdatedOrder.quantity
            } // burda SEN RESPONSE DUZELTMELISEN PIS RESPONSE ALIRSAN~!!
        });
    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error)
    }
}

const softDeleteOrder = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const orderID = Number(req.params.id);
        const order = await Order.findOne({
            where : {id : orderID},
            relations : ["user"] //payment
        })
        if(!order) {
            res.status(404).json({
                message : `Order not found~!`
            });
            return;
        }

        const deletedOrder = await Order.update(orderID , {
            isDeleted : true,
            deletedAt : new Date()
        });
        res.status(200).json({
            message : `Order deleted successfuly~!`
        });
    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error)
    }
}

export const OrderController = {
    createOrder,
    getListOrder,
    getOrderById,
    updateOrder, // UPDATE EDENDE DEMELI quantity ile totalPrice  ARASINDA YARANAN CONFIQLERE BAX~!
    softDeleteOrder,
}
