"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const token_1 = require("./../../utils/token");
const catchAsync_1 = require("../../global/catchAsync");
const auth_zod_1 = require("../../schemas/auth.zod");
const auth_service_1 = require("./auth.service");
const AppError_1 = require("../../global/AppError");
const sendResponse_1 = __importDefault(require("../../global/sendResponse"));
const token_2 = require("../../utils/token");
const Register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = auth_zod_1.RegisterSchema.safeParse(req.body);
    if (!result.success) {
        throw new AppError_1.AppError(result.error.issues[0].message, 400);
    }
    const payload = result.data;
    const user = await auth_service_1.authService.RegisterService(payload);
    if (!user) {
        throw new AppError_1.AppError("Registration failed", 400);
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, token_2.generateToken)(process.env.ACCESS_TOKEN_SECRET, jwtPayload, process.env.ACCESS_TOKEN_TIME);
    const refreshToken = (0, token_2.generateToken)(process.env.REFRESH_TOKEN_SECRET, jwtPayload, process.env.REFRESH_TOKEN_TIME);
    (0, token_1.sendCookie)(res, "accessToken", accessToken);
    (0, token_1.sendCookie)(res, "refreshToken", refreshToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Registration successfull",
        data: user,
    });
});
const Login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = auth_zod_1.LoginSchema.safeParse(req.body);
    if (!result.success) {
        throw new AppError_1.AppError(result.error.issues[0].message, 400);
    }
    const payload = result.data;
    const user = await auth_service_1.authService.LoginService(payload);
    if (!user) {
        throw new AppError_1.AppError("Login failed", 400);
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, token_2.generateToken)(process.env.ACCESS_TOKEN_SECRET, jwtPayload, process.env.ACCESS_TOKEN_TIME);
    const refreshToken = (0, token_2.generateToken)(process.env.REFRESH_TOKEN_SECRET, jwtPayload, process.env.REFRESH_TOKEN_TIME);
    (0, token_1.sendCookie)(res, "accessToken", accessToken);
    (0, token_1.sendCookie)(res, "refreshToken", refreshToken);
    const loginCredentails = {
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile || undefined,
    };
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Login successfull",
        data: loginCredentails,
    });
});
exports.authControllers = {
    Login,
    Register,
};
