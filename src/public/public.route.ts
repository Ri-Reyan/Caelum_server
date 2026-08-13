import { Router } from "express";
import { customerController } from "./public.controller";

const publicRouter = Router();

publicRouter.get("/watch", customerController.getWatches);
publicRouter.get("/watch/:id", customerController.getWatchById);

export default publicRouter;
