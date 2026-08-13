import Stripe from "stripe";
import { OrderStatus, PaymentStatus } from "../../../generated/enums";
import { prisma } from "../../config/db";
import { AppError } from "../../global/AppError";

const stripeSecretKey = process.env.STRIPE_SECRET;

if (!stripeSecretKey) {
  throw new Error("Missing required environment variable: STRIPE_SECRET");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-07-29.dahlia",
});

const createPaymentInDb = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      watch: true,
      payment: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status === OrderStatus.CONFIRMED) {
    throw new AppError("This order has already been paid", 400);
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId,
      status: PaymentStatus.PENDING,
    },
  });

  if (existingPayment) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      existingPayment.transactionId as string,
    );

    // If Stripe already succeeded, synchronize our DB
    if (paymentIntent.status === "succeeded") {
      const confirmedPayment = await confirmPaymentInDb(paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentRecord: confirmedPayment,
        order,
      };
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentRecord: existingPayment,
      order,
    };
  }

  const amountInCents = Math.round(Number(order.totalPrice) * 100);

  if (amountInCents <= 0) {
    throw new AppError("Invalid order amount", 400);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",

    payment_method_types: ["card"],

    metadata: {
      orderId: order.id,
    },
  });

  const paymentRecord = await prisma.payment.create({
    data: {
      orderId: order.id,
      transactionId: paymentIntent.id,
      amount: order.totalPrice,
      method: "Stripe",
      status: PaymentStatus.PENDING,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentRecord,
    order,
  };
};

const confirmPaymentInDb = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: {
        transactionId,
      },
    });

    if (!payment) {
      throw new AppError("Payment record not found", 404);
    }

    if (payment.status === PaymentStatus.CONFIRMED) {
      return payment;
    }

    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.CONFIRMED,
        paidAt: new Date(),
      },
    });

    await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        status: OrderStatus.CONFIRMED,
      },
    });

    return updatedPayment;
  });
};

// const failPaymentInDb = async (transactionId: string) => {
//   const payment = await prisma.payment.findUnique({
//     where: {
//       transactionId,
//     },
//   });

//   if (!payment) {
//     throw new AppError("Payment record not found", 404);
//   }

//   if (payment.status === PaymentStatus.CONFIRMED) {
//     return payment;
//   }

//   return prisma.payment.update({
//     where: {
//       id: payment.id,
//     },
//     data: {
//       status: PaymentStatus.FAILED,
//     },
//   });
// };

export const paymentService = {
  createPaymentInDb,
  confirmPaymentInDb,
  // failPaymentInDb,
};
