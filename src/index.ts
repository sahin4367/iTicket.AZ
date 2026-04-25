import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v1Router } from "./routers";
import { AppDataSource } from "./DAL/config/data-source";
import { appConfig } from "./consts";
import * as dotenv from 'dotenv';
import cors from "cors";
import { startTicketCleanupJob } from "./Core/Jobs/ticket.job";
import Consul from "consul";

dotenv.config();

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
    console.log("A user connected~!", socket.id);

    socket.on("type", (username) => {
        socket.broadcast.emit("typing-user", username);
        console.log(`${username} is typing...`);
    });

    socket.on("chat", ({ username, message }) => {
        console.log(`[${username}]: ${message}`);
        socketIO.emit("receive-message", { username, message });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected~!", socket.id);
    });
});

// Health check endpoint — Consul bu URL-i izləyir
app.get("/api/v1/health", async (_req, res) => {
    const dbOk = await AppDataSource.query("SELECT 1")
        .then(() => true)
        .catch(() => false);

    const payload = {
        status: dbOk ? "healthy" : "degraded",
        checks: {
            database: dbOk ? "up" : "down",
            uptime: Math.floor(process.uptime()),
        },
        service: "iticket-api",
        timestamp: new Date().toISOString(),
    };

    res.status(dbOk ? 200 : 503).json(payload);
});

app.use('/api/v1', v1Router);

const consulClient = new (Consul as any)({
    host: process.env.CONSUL_HOST ?? "consul",
    port: 8500,
});

async function registerWithConsul(): Promise<void> {
    try {
        await consulClient.agent.service.register({
            name: "iticket-api",
            address: "api",
            port: Number(appConfig.PORT),
            check: {
                name: "iticket-api health",
                http: `http://api:${appConfig.PORT}/api/v1/health`,
                interval: "10s",
                timeout: "3s",
                deregistercriticalserviceafter: "30s",
            },
        } as any);
        console.log("Registered with Consul~!");
    } catch (err) {
        console.warn("Consul registration failed (non-fatal):", err);
    }
}

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully~!");

        server.listen(appConfig.PORT, async () => {
            console.log(`Server is running on port - ${appConfig.PORT}.`);

            startTicketCleanupJob();
            console.log("Ticket cleanup cron job started~!");

            await registerWithConsul();
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
    });