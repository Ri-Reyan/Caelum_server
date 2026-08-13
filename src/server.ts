import "dotenv/config";
import http from "http";
import app from "./app";
import { prisma } from "./config/db";

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
    const server = http.createServer(app);

    await prisma.$connect();
    console.log("Database connected successfully!");

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Server connection failed error:", error);
    process.exit(1);
  }
};

main();
