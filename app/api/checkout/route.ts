import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { getPackageById } from "@/lib/pricing-packages";
import { paymentsLk } from "@/utils/payments-lk-client";
import {getCurrentUser} from "@/app/actions/profile-actions";

export async function POST(req:NextRequest){
    const { success, data: currentUser} = await getCurrentUser();

    if(!success || !currentUser){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(()=>null);
    const packageId = Number(body?.packageId);

    if (!body?.packageId || Number.isNaN(packageId)) {
        return NextResponse.json({ error: "packageId is required." }, { status: 400 });
    }

    const packageDef = getPackageById(packageId);
    if (!packageDef) {
        return NextResponse.json({ error: "Unknown package." }, { status: 400 });
    }

    const [order] = await db
        .insert(orders)
        .values({
            userId: currentUser.id,
            packageId: packageDef.id,
            packageName: packageDef.name,
            amountCents: packageDef.amountCents,
            status: "pending",
        })
        .returning();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await paymentsLk.checkouts.create(
        {
            amountCents: order.amountCents,
            description: `${packageDef.name} plan`,
            reference: order.id, // this comes back on the webhook event as event.data.reference
            successUrl: `${appUrl}/pricing/success?orderId=${order.id}`,
            cancelUrl: `${appUrl}/pricing`,
        },
        { idempotencyKey: `order-${order.id}` }, // a retried request never creates a second checkout for the same order
    );

    await db
        .update(orders)
        .set({ paymentsLkCheckoutId: checkout.id, updatedAt: new Date() })
        .where(eq(orders.id, order.id));

    return NextResponse.json({ url: checkout.url });

}