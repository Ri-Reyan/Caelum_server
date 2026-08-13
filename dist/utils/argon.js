"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const options = {
    type: argon2_1.default.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
};
const hashPassword = async (password) => {
    return await argon2_1.default.hash(password, options);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (hashed, plain) => {
    return await argon2_1.default.verify(hashed, plain);
};
exports.verifyPassword = verifyPassword;
