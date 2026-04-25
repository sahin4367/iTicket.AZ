import nodemailer from "nodemailer";
import { appConfig } from "./consts";

export const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: appConfig.USER_EMAIL,
        pass: appConfig.PASSWORD,
    },
});


export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: appConfig.USER_EMAIL,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
