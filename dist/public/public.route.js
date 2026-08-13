"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_controller_1 = require("./public.controller");
const publicRouter = (0, express_1.Router)();
publicRouter.get("/watch", public_controller_1.customerController.getWatches);
publicRouter.get("/watch/:id", public_controller_1.customerController.getWatchById);
exports.default = publicRouter;
