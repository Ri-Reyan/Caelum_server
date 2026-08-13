import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../global/catchAsync";
import { prisma } from "../config/db";
import { AppError } from "../global/AppError";
import sendResponse from "../global/sendResponse";

const getWatches = catchAsync(async (req: Request, res: Response) => {
  const watch = await prisma.watch.findMany();

  if (watch.length <= 0) {
    throw new AppError("Product not found", 400);
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All watches retrived successfully",
    data: watch,
  });
});

const getWatchById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Id must required", 400);
  }

  if (typeof id !== "string") {
    throw new AppError("Id must be string", 400);
  }

  const watch = await prisma.watch.findUniqueOrThrow({
    where: {
      id,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product retrived successfully",
    data: watch,
  });
});

export const customerController = {
  getWatches,
  getWatchById,
};
