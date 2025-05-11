import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { appConfig } from "./consts";

interface JwtPayload {
    sub: number;
    username: string;
}

export const setupSocket = (io: Server) => {
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("No token"));

        try {
            const decoded = jwt.verify(token, appConfig.JWT_SECRET!) as unknown as JwtPayload;
            (socket as any).user = decoded;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const { sub: userId, username } = (socket as any).user;
        console.log("User connected:", userId);

        socket.on("chat", ({ message, receiverId }) => {
            io.to(`user_${receiverId}`).emit("receive-message", {
                userId,
                username,
                message,
            });
        });

        socket.join(`user_${userId}`); // user-specific room

        socket.on("type", (receiverId: number) => {
            io.to(`user_${receiverId}`).emit("typing-user", username);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);
        });
    });
};
