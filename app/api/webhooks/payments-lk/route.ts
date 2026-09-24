import {NextRequest, NextResponse} from "next/server";
import {eq} from "drizzle-orm";
import {db} from "@/lib/db";
import {orders, subscriptions} from "@/drizzle/schema";
import {getPackageById} from "@/lib/pricing-packages";
import {paymentsLk} from "@/utils/payments-lk-client";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get("payments-signature");

    let event;
    try {
        event = paymentsLk.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.PAYMENTS_LK_WEBHOOK_SECRET!,
        );
    } catch (error) {
        console.error("[PAYMENTS_LK_WEBHOOK_INVALID_SIGNATURE]:", error);
        return new NextResponse(null, {status: 400});
    }

    try {
        if (event.type === "payment.succeeded") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await handlePaymentSucceeded(event.data.reference, event.data.amountCents);
        } else if (event.type === "payment.failed") {
            // Event name is a guess — check Payments.lk's actual docs for the
            // real failure event type and adjust this string if different.

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await handlePaymentFailed(event.data?.reference);
        }
        // Any other event types: acknowledge and ignore, don't error.
    } catch (err) {
        // Log and still return 200 below only if you're confident retries
        // won't help; otherwise return 500 here so Payments.lk retries the
        // webhook delivery (most payment providers retry on non-2xx).
        console.error("[PAYMENTS_LK_WEBHOOK_HANDLER_CRASH]:", err);
        return new NextResponse(null, {status: 500});
    }

    return new NextResponse(null, {status: 200});
}


async function handlePaymentSucceeded(orderId: string, amountCents: number) {
    const order = await db.query.orders.findFirst({where: eq(orders.id, orderId)});

    if (!order) {
        console.error("[PAYMENTS_LK_WEBHOOK_UNKNOWN_ORDER]:", orderId);
        return;
    }

    if (order.status === "paid") {
        return; // already processed — duplicate delivery, do nothing
    }

    if (order.amountCents !== amountCents) {
        // Amount mismatch between what we charged for and what Payments.lk
        // says was paid — treat as suspicious rather than silently trusting it.
        console.error("[PAYMENTS_LK_WEBHOOK_AMOUNT_MISMATCH]:", {
            orderId,
            expected: order.amountCents,
            got: amountCents
        });
        return;
    }
    // 1. orders.status: pending -> paid
    await db
        .update(orders)
        .set({status: "paid", paidAt: new Date(), updatedAt: new Date()})
        .where(eq(orders.id, order.id));

    // 2. subscriptions: inactive/expired -> active, extend expiry
    const packageDef = getPackageById(order.packageId);
    const durationDays = packageDef?.durationDays ?? 30;

    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, order.userId),
    });

    // If they still have active time left, extend from the existing expiry
    // rather than from now — renewing a couple days early shouldn't cost
    // them those remaining days.
    const baseDate =
        existingSub?.status === "active" && existingSub.expiresAt && existingSub.expiresAt > new Date()
            ? existingSub.expiresAt
            : new Date();

    const newExpiresAt = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    await db
        .insert(subscriptions)
        .values({
            userId: order.userId,
            packageId: order.packageId,
            packageName: order.packageName,
            status: "active",
            startedAt: existingSub?.startedAt ?? new Date(),
            expiresAt: newExpiresAt,
            lastOrderId: order.id,
            updatedAt: new Date(),
        })
        .onConflictDoUpdate({
            target: subscriptions.userId,
            set: {
                packageId: order.packageId,
                packageName: order.packageName,
                status: "active",
                expiresAt: newExpiresAt,
                lastOrderId: order.id,
                updatedAt: new Date(),
            },
        });

    // TODO: send a payment-confirmation email/notification here if you want one.
}


async function handlePaymentFailed(orderId: string) {
    const order = await db.query.orders.findFirst({where: eq(orders.id, orderId)});
    if (!order || order.status === "paid") return; // don't downgrade an order that already succeeded

    await db
        .update(orders)
        .set({status: "failed", updatedAt: new Date()})
        .where(eq(orders.id, order.id));
}
