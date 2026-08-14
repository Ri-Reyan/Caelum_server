import { catchAsync } from "../../global/catchAsync";
import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { AppError } from "../../global/AppError";
import sendResponse from "../../global/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId || typeof orderId !== "string") {
    throw new AppError("OrderId must requird.", 400);
  }

  if (!orderId.trim()) {
    throw new AppError("Order Id must required", 400);
  }

  const data = await paymentService.createPaymentInDb(orderId);

  if (!data) {
    throw new AppError("Something went wrong", 500);
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Intent created",
    data,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId || typeof transactionId !== "string") {
    throw new AppError("Transaction id  must required", 400);
  }

  if (!transactionId.trim()) {
    throw new AppError("Transaction Id must required", 400);
  }

  const data = await paymentService.confirmPaymentInDb(transactionId);

  if (!data) {
    throw new AppError("Something went wrong", 500);
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment confirmed",
    data,
  });
});

export const paymentController = {
  createPayment,
  confirmPayment,
};
