"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const catchAsync_1 = require("../global/catchAsync");
const auth_zod_1 = require("../schemas/auth.zod");
const admin_service_1 = require("./admin.service");
const AppError_1 = require("../global/AppError");
const sendResponse_1 = __importDefault(require("../global/sendResponse"));
const db_1 = require("../config/db");
// WATCH CONTROLLERS
const addWatch = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = auth_zod_1.addPayloadSchema.safeParse(req.body);
    if (!payload.success) {
        const errorMessage = payload.error.issues[0]?.message || "Invalid input data";
        throw new AppError_1.AppError(errorMessage, 400);
    }
    const watch = await admin_service_1.adminService.addWatchInDb(payload.data);
    if (!watch) {
        throw new AppError_1.AppError("Failed to create watch", 400);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Watch created successfully",
        data: watch,
    });
});
const updateWatch = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { watchId } = req.params; // REST standards: Get ID from params
    const payload = auth_zod_1.updatePayloadSchema.safeParse(req.body);
    if (!payload.success) {
        const errorMessage = payload.error.issues[0]?.message || "Invalid input data";
        throw new AppError_1.AppError(errorMessage, 400);
    }
    const watch = await admin_service_1.adminService.upadateWatchInDb(payload.data, watchId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Watch updated successfully",
        data: watch,
    });
});
const getAllWatch = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const watches = await db_1.prisma.watch.findMany({
        include: {
            category: true, // Includes category relation if needed
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All watches retrieved successfully",
        data: watches, // Returns [] if empty, clean for UI rendering
    });
});
const deleteWatch = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { watchId } = req.params;
    await db_1.prisma.watch.delete({
        where: {
            id: watchId,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Watch deleted successfully",
    });
});
// ----------------------------------------------------------------------
// CUSTOMER CONTROLLERS
// ----------------------------------------------------------------------
const getCustomer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customers = await db_1.prisma.customer.findMany({
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
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All customers retrieved successfully",
        data: customers,
    });
});
const deleteCustomer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { customerId } = req.params;
    await db_1.prisma.customer.delete({
        where: {
            id: customerId,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Customer deleted successfully",
    });
});
// ----------------------------------------------------------------------
// ADMIN CONTROLLERS
// ----------------------------------------------------------------------
const getAllAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const admins = await db_1.prisma.admin.findMany({
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
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All admins retrieved successfully",
        data: admins,
    });
});
const deleteAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { adminId } = req.params;
    await db_1.prisma.admin.delete({
        where: {
            id: adminId,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Admin deleted successfully",
    });
});
// ----------------------------------------------------------------------
// ORDER CONTROLLERS
// ----------------------------------------------------------------------
const getAllOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const orders = await db_1.prisma.order.findMany({
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
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All orders retrieved successfully",
        data: orders,
    });
});
const updateOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new AppError_1.AppError("Order status is required", 400);
    }
    const order = await db_1.prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Order updated successfully",
        data: order,
    });
});
exports.adminController = {
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
