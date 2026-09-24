"use server"

import { db } from "@/lib/db";
import { profiles, partnerPreferences, profileMatches } from "@/drizzle/schema";
import { eq, ne, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function calculateUserMatchesAction(userId: string) {
    try {
        const userProfile = await db.query.profiles.findFirst({
            where: eq(profiles.userId, userId),
        });

        const prefs = await db.query.partnerPreferences.findFirst({
            where: eq(partnerPreferences.userId, userId),
        });

        if (!userProfile || !prefs) {
            return { success: false, error: "Profile or Preferences missing" };
        }

        // Target opposite gender
        const targetGender = userProfile.gender === "male" ? "female" : "male";

        // Query approved potential candidate profiles
        const candidates = await db.query.profiles.findMany({
            where: and(
                ne(profiles.userId, userId),
                eq(profiles.gender, targetGender),
                eq(profiles.status, "approved")
            ),
        });

        // Calculate scores
        let score = 0;
        const matchResults = candidates.map((candidate) => {

            const reasons: string[] = [];

            // Age Check (25 pts)
            if (
                candidate.age &&
                prefs.preferredMinAge &&
                prefs.preferredMaxAge &&
                candidate.age >= prefs.preferredMinAge &&
                candidate.age <= prefs.preferredMaxAge
            ) {
                score += 25;
                reasons.push("Age within preference");
            }

            // Marital Status Check (20 pts)
            if (candidate.maritalStatus === prefs.preferredMaritalStatus) {
                score += 20;
                reasons.push("Marital status matched");
            }

            // Education Check (20 pts)
            if (
                candidate.educationLevel &&
                prefs.preferredEducationLevels?.includes(candidate.educationLevel)
            ) {
                score += 20;
                reasons.push("Education tier matched");
            }

            // Profession Check (20 pts)
            if (
                candidate.profession &&
                prefs.preferredProfessions?.includes(candidate.profession)
            ) {
                score += 20;
                reasons.push("Profession field matched");
            }

            // Income Check (15 pts)
            if (
                candidate.annualIncomeRange &&
                prefs.preferredAnnualIncomeRanges?.includes(candidate.annualIncomeRange)
            ) {
                score += 15;
                reasons.push("Income level matched");
            }

            return {
                userId,
                matchedProfileId: candidate.id,
                score,
                matchReasons: reasons,
                updatedAt: new Date(),
            };
        });

        // Upsert results into database
        if(score > 0){
            for (const match of matchResults) {
                await db.insert(profileMatches)
                    .values(match)
                    .onConflictDoUpdate({
                        target: [profileMatches.userId, profileMatches.matchedProfileId],
                        set: {
                            score: match.score,
                            matchReasons: match.matchReasons,
                            updatedAt: new Date(),
                        },
                    });
            }
        }

        revalidatePath("/best-proposals");
        return { success: true, count: matchResults.length };
    } catch (error: any) {
        console.error("[MATCHING_ENGINE_ERROR]:", error);
        return { success: false, error: error.message };
    }
}