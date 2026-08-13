"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const catchAsync_1 = require("../global/catchAsync");
const db_1 = require("../config/db");
const AppError_1 = require("../global/AppError");
const sendResponse_1 = __importDefault(require("../global/sendResponse"));
const getWatches = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const watch = await db_1.prisma.watch.findMany();
    if (watch.length <= 0) {
        throw new AppError_1.AppError("Product not found", 400);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All watches retrived successfully",
        data: watch,
    });
});
const getWatchById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError_1.AppError("Id must required", 400);
    }
    if (typeof id !== "string") {
        throw new AppError_1.AppError("Id must be string", 400);
    }
    const watch = await db_1.prisma.watch.findUniqueOrThrow({
        where: {
            id,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product retrived successfully",
        data: watch,
    });
});
exports.customerController = {
    getWatches,
    getWatchById,
};
