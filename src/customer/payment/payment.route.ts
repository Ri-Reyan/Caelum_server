import { Router } from "express";
import verifyUser from "../../middleware/verifyUser";
import { paymentController } from "./payment.controller";

const paymentRouter = Router();

paymentRouter.post(
  "/create/:orderId",
  verifyUser("customer"),
  paymentController.createPayment,
);

paymentRouter.post(
  "/confirm/:transactionId",
  verifyUser("customer"),
  paymentController.confirmPayment,
);

export default paymentRouter;
