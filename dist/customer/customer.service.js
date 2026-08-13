"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const db_1 = require("../config/db");
const AppError_1 = require("../global/AppError");
const placePreOrderInDb = async (payload, watchId, customerId) => {
    const { quantity, location } = payload;
    if (!quantity || quantity <= 0) {
        throw new AppError_1.AppError("Quantity must be at least 1", 400);
    }
    if (!location?.trim()) {
        throw new AppError_1.AppError("Location is required", 400);
    }
    const watch = await db_1.prisma.watch.findUnique({
        where: {
            id: watchId,
        },
    });
    if (!watch) {
        throw new AppError_1.AppError("Watch not found", 404);
    }
    const price = Number(watch.price) * Number(quantity);
    const order = await db_1.prisma.order.create({
        data: {
            customerId,
            watchId,
            quantity,
            totalPrice: price,
            location: location.trim(),
        },
        include: {
            watch: true,
        },
    });
    return order;
};
exports.customerService = {
    placePreOrderInDb,
};
