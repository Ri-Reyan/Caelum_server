"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const requiredEnvVars = [
    "DATABASE_URL",
    "PORT",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "STRIPE_SECRET",
];
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
const PORT = Number(process.env.PORT) || 5000;
const main = async () => {
    try {
        const server = http_1.default.createServer(app_1.default);
        await db_1.prisma.$connect();
        console.log("Database connected successfully!");
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        await db_1.prisma.$disconnect();
        console.log("Server connection failed error:", error);
        process.exit(1);
    }
};
main();
