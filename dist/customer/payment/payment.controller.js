"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const catchAsync_1 = require("../../global/catchAsync");
const payment_service_1 = require("./payment.service");
const AppError_1 = require("../../global/AppError");
const sendResponse_1 = __importDefault(require("../../global/sendResponse"));
const createPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { orderId } = req.body;
    if (!orderId.trim()) {
        throw new AppError_1.AppError("Order Id must required", 400);
    }
    const data = await payment_service_1.paymentService.createPaymentInDb(orderId);
    if (!data) {
        throw new AppError_1.AppError("Something went wrong", 500);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Intent created",
        data,
    });
});
const confirmPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { transactionId } = req.body;
    if (!transactionId.trim()) {
        throw new AppError_1.AppError("Transaction Id must required", 400);
    }
    const data = await payment_service_1.paymentService.confirmPaymentInDb(transactionId);
    if (!data) {
        throw new AppError_1.AppError("Something went wrong", 500);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Payment confirmed",
        data,
    });
});
exports.paymentController = {
    createPayment,
    confirmPayment,
};
