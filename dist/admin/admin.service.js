"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const db_1 = require("../config/db");
const AppError_1 = require("../global/AppError");
const addWatchInDb = async (payload) => {
    const { name, description, price, features, technicalData, bracelet, pictures, tag, } = payload;
    const category = await addCategoryInDb(tag);
    const watch = await db_1.prisma.watch.create({
        data: {
            name,
            description,
            price,
            features,
            technicalData,
            bracelet,
            pictures,
            categoriId: category.id,
        },
    });
    return watch;
};
const upadateWatchInDb = async (payload, watchId) => {
    const { name, description, price, features, technicalData, bracelet, pictures, tag, } = payload;
    const category = await addCategoryInDb(tag);
    const watch = await db_1.prisma.watch.update({
        where: {
            id: watchId,
        },
        data: {
            name,
            description,
            price,
            features,
            technicalData,
            bracelet,
            pictures,
            categoriId: category.id,
        },
    });
    if (!watch) {
        throw new AppError_1.AppError("Watch update failed", 400);
    }
    return watch;
};
const addCategoryInDb = async (tag) => {
    const existingCategory = await db_1.prisma.category.findUnique({
        where: {
            tags: tag,
        },
    });
    if (existingCategory) {
        return existingCategory;
    }
    const category = await db_1.prisma.category.create({
        data: {
            tags: tag,
        },
    });
    return category;
};
exports.adminService = {
    addWatchInDb,
    upadateWatchInDb,
};
