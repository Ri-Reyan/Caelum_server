"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCookie = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (secret, payload, time) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: time,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const sendCookie = (res, name, value) => {
    res.cookie(name, value, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: name === "refreshToken" ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 7,
    });
};
exports.sendCookie = sendCookie;
