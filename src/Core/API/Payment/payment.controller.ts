import { Request,Response,NextFunction } from "express";
import paypal from "../../../DAL/config/paypal";
import { Order } from "../../../DAL/models/order.model";
import { Payment } from "../../../DAL/models/payment.model";
import { EPaymentStatus } from "../../app/enums";

// const createPayment = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
//     try {
//     const { orderId } = req.body;

//     const order = await Order.findOne({ where: { id: orderId }, relations: ["user"] });
//     if (!order) {
//         res.status(404).json({ message: "order not found~!" });
//         return;
//     }


//     const paymentData = {
//     intent: "sale",
//     payer: { payment_method: "paypal" },
//     redirect_urls: {
//     return_url: "http://localhost:3000/api/payments/success",
//     cancel_url: "http://localhost:3000/api/payments/cancel"
//     },
//     transactions: [{
//     amount: {
//     total: order.totalPrice.toFixed(2),
//     currency: "USD"
//     },
//     description: `iTicket ödənişi: Sifariş #${order.id}`
//     }]
//     };

//     paypal.payment.create(paymentData, async (error, payment) => {
//     if (error) {
//     console.error(error);
//     res.status(500).json({ message: "Payment cancelled~! No." });
//     return;
//     }

//     const newPayment = Payment.create({
//     user: order.user,
//     order: order,
//     status: EPaymentStatus.PENDING,
//     paymentId: payment.id
//     });

//     await newPayment.save();

//     // const order = Yaza bilerseniz?

//     const approvalUrl = payment.links?.find(link => link.rel === "approval_url")?.href;
//     res.status(200).json({ approvalUrl: approvalUrl });
//     });

//     } catch (err) {
//     next(err);
// }
// };



const cancelPayment = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    console.log("Payment cancelled. Token:", token);

    res.status(200).json({ message: "Payment was cancelled", token });
};

export const PaymentController = {
    // createPayment,
    cancelPayment,
}