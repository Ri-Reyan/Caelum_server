import { authControllers } from "./auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", authControllers.Register);
authRouter.post("/login", authControllers.Login);
authRouter.post("/logout", authControllers.Logout);

export default authRouter;
