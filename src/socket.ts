import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { appConfig } from "./consts";
import fs from "fs";
import path from "path"; 
import { Message } from "./DAL/models/chat-IO.model";
import { User } from "./DAL/models/user.model";

export const setupSocket = (io: Server) => {

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(token, appConfig.JWT_SECRET!);
            (socket as any).user = decoded;
            next();
        } catch (err) {
            console.error("Authentication error:", err instanceof Error ? err.message : err);
            next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const user = (socket as any).user;
        console.log("User connected:", user?.sub);

        socket.join(user.sub);

        socket.on("chat", async ({ message, image, receiverId }) => {
            const senderId = user.sub;

            let imageUrl: string | null = null;

            if (image) {
                try {
                    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                    const fileName = `${Date.now()}-${senderId}.png`;
                    const filePath = path.resolve(__dirname, "uploads", fileName);

                    fs.writeFileSync(filePath, base64Data, "base64");
                    imageUrl = `/uploads/${fileName}`;
                } catch (error) {
                    console.error("Image saving error:", error);
                }
            }

            const newMessage = await Message.create({
                content: message,
                sender: { id: senderId },
                receiver: { id: receiverId },
                imageUrl: imageUrl ?? undefined,
            }).save();

            io.to(receiverId.toString()).emit("receive-message", {
                id: newMessage.id,
                senderId,
                receiverId,
                content: message,
                imageUrl,
                timestamp: newMessage.timestamp,
            });

            socket.emit("receive-message", {
                id: newMessage.id,
                senderId,
                receiverId,
                content: message,
                imageUrl,
                timestamp: newMessage.timestamp,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", user?.sub);
        });
    });
};
