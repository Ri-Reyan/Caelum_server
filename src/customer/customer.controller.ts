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

const getAllOrder = catchAsync(async (req, res) => {
  const { status } = req.body;

  if (status === OrderStatus.PENDING) {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
      },
    });

    return orders;
  } else if (status === OrderStatus.CONFIRMED) {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
      },
    });

    return orders;
  } else if (status === OrderStatus.DELIVERED) {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
      },
    });

    return orders;
  } else {
    const orders = await prisma.order.findMany();

    return orders;
  }
});

export const customerController = {
  placePreOrder,
  getAllOrder,
};
