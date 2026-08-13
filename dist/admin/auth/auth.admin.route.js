"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_admin_controller_1 = require("./auth.admin.controller");
const express_1 = require("express");
const adminAuthRouter = (0, express_1.Router)();
adminAuthRouter.post("/register", auth_admin_controller_1.authControllers.Register);
adminAuthRouter.post("/login", auth_admin_controller_1.authControllers.Login);
exports.default = adminAuthRouter;
