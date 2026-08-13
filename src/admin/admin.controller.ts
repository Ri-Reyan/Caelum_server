import { Request, Response } from "express";
import { catchAsync } from "../global/catchAsync";
import { addPayloadSchema, updatePayloadSchema } from "../schemas/auth.zod";
import { adminService } from "./admin.service";
import { AppError } from "../global/AppError";
import sendResponse from "../global/sendResponse";
import { prisma } from "../config/db";

// WATCH CONTROLLERS

const addWatch = catchAsync(async (req: Request, res: Response) => {
  const payload = addPayloadSchema.safeParse(req.body);

  if (!payload.success) {
    const errorMessage =
      payload.error.issues[0]?.message || "Invalid input data";
    throw new AppError(errorMessage, 400);
  }

  const watch = await adminService.addWatchInDb(payload.data);

  if (!watch) {
    throw new AppError("Failed to create watch", 400);
  }

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Watch created successfully",
    data: watch,
  });
});

const updateWatch = catchAsync(async (req: Request, res: Response) => {
  const { watchId } = req.params; // REST standards: Get ID from params
  const payload = updatePayloadSchema.safeParse(req.body);

  if (!payload.success) {
    const errorMessage =
      payload.error.issues[0]?.message || "Invalid input data";
    throw new AppError(errorMessage, 400);
  }

  const watch = await adminService.upadateWatchInDb(
    payload.data,
    watchId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Watch updated successfully",
    data: watch,
  });
});

const getAllWatch = catchAsync(async (req: Request, res: Response) => {
  const watches = await prisma.watch.findMany({
    include: {
      category: true, // Includes category relation if needed
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All watches retrieved successfully",
    data: watches, // Returns [] if empty, clean for UI rendering
  });
});

const deleteWatch = catchAsync(async (req: Request, res: Response) => {
  const { watchId } = req.params;

  await prisma.watch.delete({
    where: {
      id: watchId as string,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Watch deleted successfully",
  });
});

// ----------------------------------------------------------------------
// CUSTOMER CONTROLLERS
// ----------------------------------------------------------------------

const getCustomer = catchAsync(async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
      createdAt: true,
      updatedAt: true,
      // EXCLUDED password for security
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All customers retrieved successfully",
    data: customers,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  await prisma.customer.delete({
    where: {
      id: customerId as string,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customer deleted successfully",
  });
});

// ----------------------------------------------------------------------
// ADMIN CONTROLLERS
// ----------------------------------------------------------------------

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const admins = await prisma.admin.findMany({
    where: {
      id: {
        not: req.user?.id, // Exclude the current logged-in admin
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // EXCLUDED password for security
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All admins retrieved successfully",
    data: admins,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { adminId } = req.params;

  await prisma.admin.delete({
    where: {
      id: adminId as string,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin deleted successfully",
  });
});

// ----------------------------------------------------------------------
// ORDER CONTROLLERS
// ----------------------------------------------------------------------

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      watch: {
        select: {
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All orders retrieved successfully",
    data: orders,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Order status is required", 400);
  }

  const order = await prisma.order.update({
    where: {
      id: orderId as string,
    },
    data: {
      status,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order updated successfully",
    data: order,
  });
});

export const adminController = {
  addWatch,
  updateWatch,
  getCustomer,
  deleteCustomer,
  getAllAdmin,
  deleteAdmin,
  getAllWatch,
  deleteWatch,
  getAllOrders,
  updateOrder,
};
