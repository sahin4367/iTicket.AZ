import { Response, NextFunction } from "express";
import { Message } from "../../../DAL/models/chat-IO.model";
import { CustomRequest } from "../../../type/custome-request";

const createMessage = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { content, imageUrl, receiverId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User not found." });
            return;
        }

        const message = Message.create({
            content,
            imageUrl,
            sender: { id: userId },
            receiver: { id: receiverId },
        });

        await message.save();

        res.status(201).json({ message: "Message created successfully", data: message });
    } catch (error) {
        console.error("Create message error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllMessages = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const messages = await Message.find({
            where: [
                { sender: { id: userId } },
                { receiver: { id: userId } }
            ],
            relations: ["sender", "receiver"],
            order: { timestamp: "DESC" }
        });

        const cleanedMessages = messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            imageUrl: msg.imageUrl,
            timestamp: msg.timestamp,
            sender: msg.sender
                ? {
                    id: msg.sender.id,
                    name: msg.sender.name,
                    email: msg.sender.email
                }
                : null,
            receiver: msg.receiver
                ? {
                    id: msg.receiver.id,
                    name: msg.receiver.name,
                    email: msg.receiver.email
                }
                : null,
        }));

        res.status(200).json({
            message: "Messages fetched successfully~!",
            data: cleanedMessages
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const chatController = { 
    createMessage ,
    getAllMessages
};
