"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../global/AppError");
const argon_1 = require("../../utils/argon");
const RegisterService = async (payload) => {
    const { name, email, password } = payload;
    const ExistingUser = await db_1.prisma.admin.findUnique({
        where: {
            email,
        },
    });
    if (ExistingUser) {
        throw new AppError_1.AppError("User already exits", 400);
    }
    const hashedPass = await (0, argon_1.hashPassword)(password);
    const user = await db_1.prisma.admin.create({
        data: {
            name,
            email,
            password: hashedPass,
        },
        omit: {
            password: true,
        },
    });
    return user;
};
const LoginService = async (payload) => {
    const { email, password } = payload;
    const user = await db_1.prisma.admin.findUniqueOrThrow({
        where: {
            email,
        },
    });
    const isMatched = await (0, argon_1.verifyPassword)(user.password, password);
    if (!isMatched) {
        throw new AppError_1.AppError("Email or password incorrect", 400);
    }
    return user;
};
exports.authService = {
    RegisterService,
    LoginService,
};
