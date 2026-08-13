import { Router } from "express";
import verifyUser from "../../middleware/verifyUser";
import { paymentController } from "./payment.controller";

const paymentRouter = Router();

paymentRouter.post(
  "/create",
  verifyUser("customer"),
  paymentController.createPayment,
);
paymentRouter.post(
  "/confirm",
  verifyUser("customer"),
  paymentController.confirmPayment,
);

export default paymentRouter;
