"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../global/catchAsync");
const token_1 = require("../utils/token");
const db_1 = require("../config/db");
const AppError_1 = require("../global/AppError");
const verifyUser = (ROLE) => (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    let decoded;
    try {
        decoded = (0, token_1.verifyToken)(accessToken, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (error) {
        if (!refreshToken) {
            throw new AppError_1.AppError("Unauthorized", 401);
        }
        const refreshDecoded = (0, token_1.verifyToken)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user;
        if (ROLE === "admin") {
            user = await db_1.prisma.admin.findUnique({
                where: {
                    id: refreshDecoded.id,
                },
            });
        }
        else {
            user = await db_1.prisma.customer.findUnique({
                where: {
                    id: refreshDecoded.id,
                },
            });
        }
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        if (user.role !== ROLE) {
            throw new AppError_1.AppError("You are not allowed", 403);
        }
        const newAccessToken = (0, token_1.generateToken)(process.env.ACCESS_TOKEN_SECRET, {
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.ACCESS_TOKEN_TIME);
        const newRefreshToken = (0, token_1.generateToken)(process.env.REFRESH_TOKEN_SECRET, {
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.REFRESH_TOKEN_TIME);
        (0, token_1.sendCookie)(res, "accessToken", newAccessToken);
        (0, token_1.sendCookie)(res, "refreshToken", newRefreshToken);
        decoded = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
    let user;
    if (ROLE === "admin") {
        user = await db_1.prisma.admin.findUnique({
            where: {
                id: decoded.id,
            },
        });
    }
    else {
        user = await db_1.prisma.customer.findUnique({
            where: {
                id: decoded.id,
            },
        });
    }
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    next();
});
exports.default = verifyUser;
