import { prisma } from "../config/db";
import { AppError } from "../global/AppError";
import { PlaceOrderType } from "./customer.interface";

const placePreOrderInDb = async (
  payload: PlaceOrderType,
  watchId: string,
  customerId: string,
) => {
  const { quantity, location } = payload;

  if (!quantity || quantity <= 0) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  if (!location?.trim()) {
    throw new AppError("Location is required", 400);
  }

  const watch = await prisma.watch.findUnique({
    where: {
      id: watchId,
    },
  });

  if (!watch) {
    throw new AppError("Watch not found", 404);
  }

  const price = Number(watch.price) * Number(quantity);

  const order = await prisma.order.create({
    data: {
      customerId,
      watchId,
      quantity,
      totalPrice: price,
      location: location.trim(),
    },
    include: {
      watch: true,
    },
  });

  return order;
};

export const customerService = {
  placePreOrderInDb,
};
