import { Router } from "express";
import verifyUser from "../middleware/verifyUser";
import { customerController } from "./customer.controller";

const customerRouter = Router();

customerRouter.post(
  "/place-order",
  verifyUser("customer"),
  customerController.placePreOrder,
);
customerRouter.get(
  "/all-orders",
  verifyUser("customer"),
  customerController.getAllOrder,
);

export default customerRouter;
