"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = __importDefault(require("../middleware/verifyUser"));
const customer_controller_1 = require("./customer.controller");
const customerRouter = (0, express_1.Router)();
customerRouter.post("/place-order", (0, verifyUser_1.default)("customer"), customer_controller_1.customerController.placePreOrder);
customerRouter.get("/all-orders", (0, verifyUser_1.default)("customer"), customer_controller_1.customerController.getAllOrder);
exports.default = customerRouter;
