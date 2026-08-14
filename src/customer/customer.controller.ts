import { catchAsync } from "../global/catchAsync";
import { Request, Response } from "express";
import { customerService } from "./customer.service";
import { AppError } from "../global/AppError";
import sendResponse from "../global/sendResponse";
import { OrderStatus } from "../../generated/enums";
import { prisma } from "../config/db";

const placePreOrder = catchAsync(async (req: Request, res: Response) => {
  const { watchId } = req.params;
  const customerId = req.user?.id;
  const payload = req.body;

  const order = await customerService.placePreOrderInDb(
    payload,
    watchId as string,
    customerId as string,
  );

  if (!order) {
    throw new AppError("Something went wrong", 400);
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order placed  successfully",
    data: order,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.query;

  const whereConditions: any = {};

  if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
    whereConditions.status = status as OrderStatus;
  }

  // Prisma query
  const orders = await prisma.order.findMany({
    where: whereConditions,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      watch: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = (req as any).user?.id;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId as string,
    },
    include: {
      watch: true,
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Security Check: ইউজার যেন অন্যের অর্ডার দেখতে না পারে
  if (order.customerId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access to this order",
    });
  }

  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    data: order,
  });
});

export const customerController = {
  placePreOrder,
  getAllOrder,
  getOrderById,
};
