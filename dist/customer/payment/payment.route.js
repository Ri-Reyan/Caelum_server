"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = __importDefault(require("../../middleware/verifyUser"));
const payment_controller_1 = require("./payment.controller");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/create", (0, verifyUser_1.default)("customer"), payment_controller_1.paymentController.createPayment);
paymentRouter.post("/confirm", (0, verifyUser_1.default)("customer"), payment_controller_1.paymentController.confirmPayment);
exports.default = paymentRouter;
