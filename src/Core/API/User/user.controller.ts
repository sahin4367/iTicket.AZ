import { Response,NextFunction } from "express";
import { CustomRequest } from "../../../type/custome-request";
import { EUsesrRole } from "../../app/enums";
import { User } from "../../../DAL/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO } from "./user.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../Middlewares/errors.middleware";


const register = async(req:CustomRequest,res:Response,next:NextFunction): Promise<void> => {
    try {
        const {name,surname,phone,email,password,role} = req.body;
        if (!name || !surname || !phone || !email || !password || !role) {
            res.status(400).json({message : "Please fill all fields~!"});
            return;
        }

        if (role === EUsesrRole.ADMIN) {
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
            res.status(401).json({ message: "Email ve ya shifre sehvdir!" });
            console.log("user yoxdur");
            return;
        }


        const isValidPassword = await bcrypt.compare(password,user.password);
        if (!isValidPassword) {
            res.status(401).json({
                message: "Email ve ya shifre sehvdir!",
            });
            console.log("parol yalnisdir");
            return;
            }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            message: `User login successfully~!`,
            token,
        });


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : error,
        });
    }
}
export const UserController = {
    register,
    login
}