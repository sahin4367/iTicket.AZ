import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { appConfig } from "./consts";

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
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", (socket as any).user.sub);

        socket.on("chat", (message) => {
            const userId = (socket as any).user.sub;
            io.emit("receive-message", { userId, message });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", (socket as any).user.sub);
        });
    });
};



