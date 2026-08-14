import { Router } from "express";
import verifyUser from "../middleware/verifyUser";
import { adminController } from "./admin.controller";

const adminRouter = Router();

adminRouter.post("/add", verifyUser("admin"), adminController.addWatch);
adminRouter.put(
  "/update-watch/:watchId",
  verifyUser("admin"),
  adminController.updateWatch,
);
adminRouter.get("/customer", verifyUser("admin"), adminController.getCustomer);
adminRouter.delete(
  "/delete-customer/:customerId",
  verifyUser("admin"),
  adminController.deleteCustomer,
);
adminRouter.get(
  "/fetch-admin",
  verifyUser("admin"),
  adminController.getAllAdmin,
);
adminRouter.delete(
  "/delete-admin/:adminId",
  verifyUser("admin"),
  adminController.deleteAdmin,
);
adminRouter.get(
  "/fetch-watch",
  verifyUser("admin"),
  adminController.getAllWatch,
);
adminRouter.delete(
  "/delete-watch/:watchId",
  verifyUser("admin"),
  adminController.deleteWatch,
);
adminRouter.get(
  "/fetch-order",
  verifyUser("admin"),
  adminController.getAllOrders,
);
adminRouter.put(
  "/update-order/:orderId",
  verifyUser("admin"),
  adminController.updateOrder,
);

export default adminRouter;
