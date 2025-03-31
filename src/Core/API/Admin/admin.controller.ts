import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { CreateUserByAdminDTO, EditUserByAdminDTO } from "./admin.dto";
import {EUsesrRole, UpdateUserDTO} from "../../app/enums";
import { User } from "../../../DAL/models/user.model";
import { CustomRequest } from "../../../type/custome-request";

    
const userCreateAdmin = async (req: CustomRequest, res: Response, next: NextFunction):Promise<void> => {
    try {
        const { name, surname, email, role, password, phone } = req.body;
    
        const currentUserRole = req.user?.role; 
    
        if (currentUserRole !== "ADMIN") {
            res.status(403).json({ message: "Only admins can create users." });
            return;
        }

        if (role && !(role in EUsesrRole)) {
            throw new Error(`Invalid role! Allowed roles: ${Object.keys(EUsesrRole).join(", ")}`);
        }
    
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }

        const existPhone = await User.findOne({
            where : { phone : phone }
        });
        if (existPhone) {
            res.status(400).json({message : "Phone already exists~!"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const dto = new CreateUserByAdminDTO();
        dto.name = name;
        dto.surname = surname;
        dto.email = email;
        dto.role = role;
        dto.password = password;
        dto.phone = phone;

        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(err => err.constraints) });
            return;
        }
    
        const newUser = User.create({
            name,
            surname,
            email,
            role,
            password: hashedPassword,
            phone,
        });
    
        await newUser.save();
    
        res.status(201).json({
            message: "User created successfully.",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
            },
            });
            return;
        } catch (error) {
            res.status(500).json({
                message: "Something went wrong.",
                error: error instanceof Error ? error.message : "Unknown error occurred.",
            });
            return;
        }
    };

const UserList = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find({
            select : {
                id : true,
                name : true,
                surname : true,
                role : true,
                email : true,
                phone : true,
                createdAt : true,
                updatedAt : true,
                deletedAt : true,
            }
        });
        res.status(200).json({
            message: "Users list~!",
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong.",
            error: error instanceof Error ? error.message : "Unknown error occurred.",
        });
    }
};

const userEdit = async (req: CustomRequest, res: Response, next: NextFunction):Promise<void> => {
    try {
        const userID = Number(req.params.id);
        const UpdateData : UpdateUserDTO = req.body;
        const user = await User.findOne({
            where : { id : userID},
        });
        if (!user) {
            res.status(404).json({
                message : "User not found~!"
            });
            return ;
        }

        if (UpdateData.password) {
            const saltResult = 10;
            UpdateData.password = await  bcrypt.hash(UpdateData.password , saltResult);
        }

        Object.assign(user,UpdateData);

        const updatedUser = await user.save();
        res.status(200).json({
            message : `User edited successfully~!`,
            user : {
                name : updatedUser.name,
                surname : updatedUser.surname,
                email : updatedUser.email,
                role : updatedUser.role,
                phone : updatedUser.phone,

            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong.",
            error: error instanceof Error ? error.message : "Unknown error occurred.",
        });
        return;
    }
}

const userDelete = async (req: CustomRequest, res: Response, next: NextFunction):Promise<void> => {
    try {
        const userID = Number(req.params.id);
        const user = await User.findOne({
            where : { id : userID},
        });
        if (!user) {
            res.status(404).json({
                message : "User not found~!"
            });
            return ;
        }
        const deletedUser = await User.update(userID,{
            isdeleted : true,
            deletedAt : new Date()
        });
        res.json({
            message : `User id:${userID} deleted successfully~!`,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong.",
            error: error instanceof Error ? error.message : "Unknown error occurred.",
        });
        return;
    }
}


export const AdminController = {
    userCreateAdmin,
    UserList,
    userEdit,
    userDelete,
}