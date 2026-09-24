"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {db} from "@/lib/db";
import {profiles, verifications} from "@/drizzle/schema";
import {eq} from "drizzle-orm";

const SubmitVerificationSchema = z.object({
    documentFrontUrl: z.string().min(1, "Front NIC image is required"),
    documentBackUrl: z.string().min(1, "Back NIC image is required"),
    idNumber: z.string().min(1, "NIC / ID Number is required"),
});

export type SubmitVerificationInput = z.infer<typeof SubmitVerificationSchema>;

export async function submitVerificationAction(input: SubmitVerificationInput) {
    try {
        const validatedData = SubmitVerificationSchema.parse(input);

        const {data: currentUser} = await getCurrentUser();

        if (!currentUser) {
            return {
                success: false,
                message: "Session expired. Please log in again to complete verification.",
            };
        }

        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.userId, currentUser.id),
            columns: { id: true },
        });

        if (!profile) {
            return {
                success: false,
                message: "Profile record not found. Please complete basic onboarding first.",
            };
        }

        await db
            .insert(verifications)
            .values({
                profileId: profile.id,
                idNumber: validatedData.idNumber,
                documentFrontUrl: validatedData.documentFrontUrl,
                documentBackUrl: validatedData.documentBackUrl,
                status: "pending",
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: verifications.profileId, // Unique constraint on profile_id
                set: {
                    idNumber: validatedData.idNumber,
                    documentFrontUrl: validatedData.documentFrontUrl,
                    documentBackUrl: validatedData.documentBackUrl,
                    status: "pending",
                    rejectionReason: null, // Clear any previous rejection notes
                    updatedAt: new Date(),
                },
            });

        revalidatePath("/my-dashboard");
        revalidatePath("/verify-account");

        return {
            success: true,
            message: "NIC verification documents submitted successfully.",
        };
    } catch (err) {
        console.error("[SUBMIT_VERIFICATION_ACTION_ERROR]", err);
        return {
            success: false,
            message: "An unexpected error occurred while processing your request.",
        };
    }
}