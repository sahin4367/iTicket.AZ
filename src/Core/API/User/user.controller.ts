import { Response,NextFunction } from "express";
import { CustomRequest } from "../../../type/custome-request";
import { User } from "../../../DAL/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO } from "./user.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../Middlewares/errors.middleware";
import moment from "moment";
import { appConfig } from "../../../consts";
import { transporter } from "../../../helpers";
import { EUserRole } from "../../app/enums";
import { number } from "joi";
import { access } from "fs";


const register = async(req:CustomRequest,res:Response,next:NextFunction): Promise<void> => {
    try {
        const {name,surname,phone,email,password,role} = req.body;
        if (!name || !surname || !phone || !email || !password || !role) {
            res.status(400).json({message : "Please fill all fields~!"});
            return;
        }

        if (role === EUserRole.ADMIN) {
            res.json("Error~!");
            return;
        }

        const user = await User.findOne({
            where : { email : email}
        });

        if (user) {
            res.status(400).json({message : "User already exists~!"});
            return;
        }

        const existPhone = await User.findOne({
            where : { phone : phone}
        });
        if (existPhone) {
            res.status(400).json({message : "Phone already exists~!"});
            return;
        }

        const newPassword = await bcrypt.hash(password,10);

        const dto = new RegisterDTO();
        dto.name = name;
        dto.surname = surname;
        dto.phone = phone;
        dto.email = email;
        dto.password = newPassword;
        dto.role = role;

        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json(formatErrors(errors));
            return;
        }

        const newUser = User.create({
            name : name,
            surname : surname,
            phone : phone,
            email : email,
            password : newPassword,
            role : role
        })

        await newUser.save();
        const Data = await User.findOne({
            where : {email : email},
            select : ["id","name","surname","phone","email","role"]
        });

        res.status(201).json(Data); 
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : error,
        });
    }
}

const login = async(req:CustomRequest,res:Response,next:NextFunction): Promise<void> => {
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            res.status(400).json({
                message : "Please fill all fields~!"
            });
            return;
        }
        const user = await User.findOne({
            where : {email : email}
        });
        if (!user) {
            res.status(401).json({ message: "Email or password incorrect~!" });
            console.log("User not found~!");
            return;
        }


        const isValidPassword = await bcrypt.compare(password,user.password);
        if (!isValidPassword) {
            res.status(401).json({
                message: "Email or password incorrect~!",
            });
            console.log("Password incorrect~!");
            return;
            }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            message: `User login successfully~!`,
            access_token: token,
        });


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : error,
        });
    }
}

const verifyEmail = async(req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    try {
        if(!req.user) {
            res.status(401).json({message : "Unauthorized"});
            return;
        }

        const user = req.user;
        if (user.isVerifiedEmail) {
            res.status(400).json({
                message : `Email already verified~!`
            });
            return;
        }

        //create random code : 
        const randomCode = Math.floor(100000 + Math.random() * 999999);
        const codeExpireAt = moment().add(appConfig.verifyCodeExpiteMinute , "minutes").toDate();
        user.codeExpireAt = codeExpireAt;
        user.verifyCode = randomCode;
        await user.save();

        const mailOptions = {
            from : appConfig.USER_EMAIL,
            to : req.user.email.toString(),
            subject : "Email verificartion!",
            text : `Your verification code - ${randomCode}`,
        }
        transporter.sendMail(mailOptions , (error,info) => {
            if (error) {
                res.status(500).json({message : error.message , error})
            } else {
                return res.json({
                    message : `Verification code sent to your email. 
                    It will expire in ${appConfig.verifyCodeExpiteMinute} minutes.`
                });
            }
        })
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong",
        });
        next(error);
    }
}

const checkVerifyCode = async(req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    try {
        if(!req.user) {
            res.status(401).json({message : "Unauthorized"});
            return;
        }
        const user = req.user;
        const {code} = req.body;

        if(!code){
            res.status(400).json({
                message : `Verification code is required~!`
            });
            return;
        }

        if (user.isVerifiedEmail) {
            res.status(400).json({
                message : `Email already verified~!`
            });
            return;
        }

        if (user.codeExpireAt === null || user.codeExpireAt < new Date()) {
            res.status(400).json({
                message : `Verification code expired or is invalid~!`
            });
            return;
        }

        if (user.verifyCode === code && user.codeExpireAt > new Date()) {
            user.isVerifiedEmail = true;
            user.verifyCode = null;
            user.codeExpireAt = null

            await user.save();
            res.json({
                message : `Email verified successfully~!`
            })
        }   else {
            res.status(400).json({
                message: "Invalid or expired verification code.",
            });
        }

    } catch (error) {
        res.status(500).json({
            message : `An occured error~!`
        });
        next(error);
    }
}

export const UserController = {
    register,
    login,
    verifyEmail,
    checkVerifyCode
}