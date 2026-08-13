import { authControllers } from "./auth.admin.controller";
import { Router } from "express";

const adminAuthRouter = Router();

adminAuthRouter.post("/register", authControllers.Register);
adminAuthRouter.post("/login", authControllers.Login);

export default adminAuthRouter;
