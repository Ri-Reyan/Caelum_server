"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth.controller");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", auth_controller_1.authControllers.Register);
authRouter.post("/login", auth_controller_1.authControllers.Login);
exports.default = authRouter;
