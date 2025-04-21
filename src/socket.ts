import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { appConfig } from "./consts";
import fs from "fs";
import path from "path"; 
import { ChatMessage } from "./Core/app/enums";

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


        socket.on("chat", async ({ username, message, image }) => {
            const newMessage: ChatMessage = {
                username,
                message,
                imageUrl: null, 
            };

            if (image) {
                try {
                    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                    const fileName = `${Date.now()}-${username}.png`;
                    const filePath = path.resolve(__dirname, "uploads", fileName); 


                    fs.writeFileSync(filePath, base64Data, "base64");


                    newMessage.imageUrl = `/uploads/${fileName}`;
                    console.log(`Şəkil saxlanıldı: ${filePath}`);
                } catch (error) {
                    console.error("Şəkili saxlayarkən xəta baş verdi:", error);
                }
            }

            io.emit("receive-message", newMessage);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", user?.sub);
        });
    });
};