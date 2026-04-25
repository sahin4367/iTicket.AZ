import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Payment } from "../../../DAL/models/payment.model";
import { Order } from "../../../DAL/models/order.model";
import { EPaymentStatus } from "../../app/enums";
import paypal from "../../../DAL/config/paypal";
import { sendEmail } from "../../../helpers";
dotenv.config();

const createTestPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({ where: { id: orderId }, relations: ["user"] });
        if (!order) {
            res.status(404).json({ message: "Order not found~!" });
            return;
        }

        const fakePayment = await Payment.create({
            user: order.user,
            order: order,
            status: EPaymentStatus.PENDING,
            paymentId: `FAKE_${orderId}_${Date.now()}`
        }).save();

        res.redirect(`Redairect Id : ${fakePayment.paymentId}`);
    } catch (error) {
        next(error);
    }
};

const showTestPaymentPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { paymentId } = req.params;

        res.send(`<Ödənişi tamamla>`);
    } catch (error) {
        next(error);
    }
};

const completeTestPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findOne({ where: { paymentId }, relations: ["order", "user"] });

        if (!payment) {
            res.status(404).send("Payment not found");
            return;
        }

        payment.status = EPaymentStatus.SUCCESS;
        await payment.save();

        await sendEmail(
            payment.user.email,
            "Ödəniş uğurla tamamlandı!",
            `Hörmətli ${payment.user.name},\nSiz sifariş #${payment.order.id} üçün ödənişi uğurla tamamladınız. Təşəkkür edirik!`
        );

        res.send(`Ödəniş uğurla tamamlandı!
                    <p>İndi sistemdə biletiniz aktivdir.</p>`);
    } catch (error) {
        next(error);
    }
};

//-------------------------------------------------------------------------------------------------------------
const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({
        where: { id: orderId },
        relations: ["user"],
        });

        if (!order) {
        res.status(404).json({ message: "Sifariş tapılmadı!" });
        return;
        }

        const paymentData = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://localhost:4000/api/payments/success",
            cancel_url: "http://localhost:4000/api/payments/cancel",
        },
        transactions: [
            {
            amount: {
                total: order.totalPrice.toFixed(2),
                currency: "USD",
            },
            description: `Payment for order #${order.id}`,
            },
        ],
        };

        paypal.payment.create(paymentData, async (error, payment) => {
        if (error) {
            console.error("PayPal error:", error.response);
            res.status(500).json({ message: "Payment not created!" });
            return;
        }

        const newPayment = new Payment();
        newPayment.order = order;
        newPayment.user = order.user;
        newPayment.status = EPaymentStatus.PENDING;
        newPayment.paymentId = payment.id!;
        await newPayment.save();

        const approvalUrl = payment.links?.find((link) => link.rel === "approval_url")?.href;
        res.status(200).json({ approvalUrl });
        });
    } catch (error) {
        console.error("createPayment error:", error);
        next(error);
    }
    };

const paymentSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { paymentId, PayerID, orderId } = req.query;


    const payerId = String(PayerID);
    const order = String(orderId);

    if (!paymentId || !payerId || !order) {
        res.status(400).json({ message: "Missing parameters" });
        return;
    }

    try {

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: "10.00", 
                    },
                },
            ],
        };


        paypal.payment.execute(paymentId as string, execute_payment_json, async (error, payment) => {
            if (error) {
                console.error(error.response || error);
                return res.status(500).json({ message: "Payment execution failed!" });
            } else {

                const paymentRecord = await Payment.findOne({ where: { paymentId: paymentId as string } });
                
                if (!paymentRecord) {
                    return res.status(404).json({ message: "Payment record not found!" });
                }

                paymentRecord.status = EPaymentStatus.SUCCESS;
                paymentRecord.payerId = payerId;
                await paymentRecord.save();

                res.status(200).json({ message: "Payment successfully completed!" });
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const PaymentController = {
    createPayment,
    paymentSuccess,
    createTestPayment,
    showTestPaymentPage,
    completeTestPayment
};




