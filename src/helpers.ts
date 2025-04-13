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