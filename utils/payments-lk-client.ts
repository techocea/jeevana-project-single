import { PaymentsLk } from "@payments-lk/node";

if (!process.env.PAYMENTS_LK_SECRET_KEY) {
    throw new Error("PAYMENTS_LK_SECRET_KEY is not set");
}

// Singleton — avoid constructing a new client on every request.
export const paymentsLk = new PaymentsLk(process.env.PAYMENTS_LK_SECRET_KEY);
