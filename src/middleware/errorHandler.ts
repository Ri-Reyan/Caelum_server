import { Request, Response, NextFunction } from "express";
import { AppError } from "../global/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    err = new AppError(`A record with this ${field} already exists.`, 400);
  }

  if (err.code === "P2025") {
    err = new AppError("The requested record was not found.", 404);
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Something went wrong! Please try again later.",
  });
};
