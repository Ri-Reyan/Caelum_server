import express from "express";
import type { Request, Response } from "express";
import { AppError } from "./global/AppError";
import { globalErrorHandler } from "./middleware/errorHandler";
import authRouter from "./customer/auth/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminAuthRouter from "./admin/auth/auth.admin.route";
import adminRouter from "./admin/admin.route";
import publicRouter from "./public/public.route";
import customerRouter from "./customer/customer.route";
import paymentRouter from "./customer/payment/payment.route";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth/user", authRouter);
app.use("/auth/admin", adminAuthRouter);

app.use("/api", publicRouter);
app.use("/api/customer", customerRouter);
app.use("/api/admin", adminRouter);

app.use("/api/payment", paymentRouter);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
