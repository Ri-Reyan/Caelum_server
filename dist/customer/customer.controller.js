"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const catchAsync_1 = require("../global/catchAsync");
const customer_service_1 = require("./customer.service");
const AppError_1 = require("../global/AppError");
const sendResponse_1 = __importDefault(require("../global/sendResponse"));
const enums_1 = require("../../generated/enums");
const db_1 = require("../config/db");
const placePreOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { watchId } = req.params;
    const customerId = req.user?.id;
    const payload = req.body;
    const order = await customer_service_1.customerService.placePreOrderInDb(payload, watchId, customerId);
    if (!order) {
        throw new AppError_1.AppError("Something went wrong", 400);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Order placed  successfully",
        data: order,
    });
});
const getAllOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.body;
    if (status === enums_1.OrderStatus.PENDING) {
        const orders = await db_1.prisma.order.findMany({
            where: {
                status: enums_1.OrderStatus.PENDING,
            },
        });
        return orders;
    }
    else if (status === enums_1.OrderStatus.CONFIRMED) {
        const orders = await db_1.prisma.order.findMany({
            where: {
                status: enums_1.OrderStatus.CONFIRMED,
            },
        });
        return orders;
    }
    else if (status === enums_1.OrderStatus.DELIVERED) {
        const orders = await db_1.prisma.order.findMany({
            where: {
                status: enums_1.OrderStatus.DELIVERED,
            },
        });
        return orders;
    }
    else {
        const orders = await db_1.prisma.order.findMany();
        return orders;
    }
});
exports.customerController = {
    placePreOrder,
    getAllOrder,
};
