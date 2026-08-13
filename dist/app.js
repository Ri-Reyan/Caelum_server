"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppError_1 = require("./global/AppError");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_route_1 = __importDefault(require("./customer/auth/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_admin_route_1 = __importDefault(require("./admin/auth/auth.admin.route"));
const admin_route_1 = __importDefault(require("./admin/admin.route"));
const public_route_1 = __importDefault(require("./public/public.route"));
const customer_route_1 = __importDefault(require("./customer/customer.route"));
const payment_route_1 = __importDefault(require("./customer/payment/payment.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/auth/user", auth_route_1.default);
app.use("/auth/admin", auth_admin_route_1.default);
app.use("/api", public_route_1.default);
app.use("/api/customer", customer_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/payment", payment_route_1.default);
app.get("/", async (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});
app.all("/{*splat}", (req, res, next) => {
    next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
