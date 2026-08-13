"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const enums_1 = require("../../../generated/enums");
const db_1 = require("../../config/db");
const AppError_1 = require("../../global/AppError");
const stripeSecretKey = process.env.STRIPE_SECRET;
if (!stripeSecretKey) {
    throw new Error("Missing required environment variable: STRIPE_SECRET");
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2026-07-29.dahlia",
});
const createPaymentInDb = async (orderId) => {
    const order = await db_1.prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            watch: true,
            payment: true,
        },
    });
    if (!order) {
        throw new AppError_1.AppError("Order not found", 404);
    }
    if (order.status === enums_1.OrderStatus.CONFIRMED) {
        throw new AppError_1.AppError("This order has already been paid", 400);
    }
    const existingPayment = await db_1.prisma.payment.findFirst({
        where: {
            orderId,
            status: enums_1.PaymentStatus.PENDING,
        },
    });
    if (existingPayment) {
        const paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.transactionId);
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
        throw new AppError_1.AppError("Invalid order amount", 400);
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
            orderId: order.id,
        },
    });
    const paymentRecord = await db_1.prisma.payment.create({
        data: {
            orderId: order.id,
            transactionId: paymentIntent.id,
            amount: order.totalPrice,
            method: "Stripe",
            status: enums_1.PaymentStatus.PENDING,
        },
    });
    return {
        clientSecret: paymentIntent.client_secret,
        paymentRecord,
        order,
    };
};
const confirmPaymentInDb = async (transactionId) => {
    return await db_1.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
            where: {
                transactionId,
            },
        });
        if (!payment) {
            throw new AppError_1.AppError("Payment record not found", 404);
        }
        if (payment.status === enums_1.PaymentStatus.CONFIRMED) {
            return payment;
        }
        const updatedPayment = await tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: enums_1.PaymentStatus.CONFIRMED,
                paidAt: new Date(),
            },
        });
        await tx.order.update({
            where: {
                id: payment.orderId,
            },
            data: {
                status: enums_1.OrderStatus.CONFIRMED,
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
exports.paymentService = {
    createPaymentInDb,
    confirmPaymentInDb,
    // failPaymentInDb,
};
