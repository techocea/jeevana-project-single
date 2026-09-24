"use server";

import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/app/actions/profile-actions"; // adjust path

export async function getOrderStatus(orderId: string) {
    const { success, data: currentUser } = await getCurrentUser();
    if (!success || !currentUser) {
        return { success: false, error: "Unauthorized" };
    }

    const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });

    if (!order) {
        return { success: false, error: "Order not found." };
    }

    // Don't let one user poll another user's order id.
    if (order.userId !== currentUser.id) {
        return { success: false, error: "Not your order." };
    }

    return {
        success: true,
        data: { status: order.status, packageName: order.packageName },
    };
}