import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v1Router } from "./routers";
import { AppDataSource } from "./DAL/config/data-source";
import { appConfig } from "./consts";
import * as dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
});

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const socketIO = new Server(server, {
    cors: {
    origin: "*",
    },
});

socketIO.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("type", (username) => {
    socket.broadcast.emit("typing-user", username);

    console.log(`${username} is typing...`);
    });
    
    socket.on("chat", ({ username, message }) => {
    console.log(`[${username}]: ${message}`);

    socketIO.emit("receive-message", { username, message });
    });

    socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    });
});

app.use('/api/v1' ,v1Router);

server.listen(appConfig.PORT ,() => {
    console.log(`Server is running on port - ${appConfig.PORT}`);
});