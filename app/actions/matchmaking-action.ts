"use server"

import {db} from "@/lib/db";
import {profiles, partnerPreferences, profileMatches} from "@/drizzle/schema";
import {eq, ne, and} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {getAccurateAge} from "@/helpers/format-date";

export async function calculateUserMatchesAction(userId: string) {
    try {
        const userProfile = await db.query.profiles.findFirst({
            where: eq(profiles.userId, userId),
        });

        const prefs = await db.query.partnerPreferences.findFirst({
            where: eq(partnerPreferences.userId, userId),
        });

        if (!userProfile || !prefs) {
            return {success: false, error: "Profile or Preferences missing"};
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

        // Calculate each candidate's score independently.
        const matchResults = candidates.map((candidate) => {
            let score = 0;
            const reasons: string[] = [];

            // Supports DOB returned as either a Date or an ISO date string.
            const parsedDOB = candidate.dob
                ? candidate.dob instanceof Date
                    ? candidate.dob.toISOString().split("T")[0]
                    : String(candidate.dob).split("T")[0]
                : null;

            // Do not pass null into a helper whose signature we haven't seen.
            const age = parsedDOB
                ? getAccurateAge(parsedDOB)
                : null;

            // Age Check (25 pts)
            // Preserve your current rule: both age bounds must be provided.
            if (
                typeof age === "number" &&
                Number.isFinite(age) &&
                age >= 0 &&
                prefs.preferredMinAge != null &&
                prefs.preferredMaxAge != null &&
                age >= prefs.preferredMinAge &&
                age <= prefs.preferredMaxAge
            ) {
                score += 25;
                reasons.push("Age within preference");
            }

            // Marital Status Check (20 pts)
            if (
                candidate.maritalStatus &&
                prefs.preferredMaritalStatuses &&
                candidate.maritalStatus === prefs.preferredMaritalStatuses
            ) {
                score += 20;
                reasons.push("Marital status matched");
            }

            // Education Check (20 pts)
            if (
                candidate.educationLevel &&
                prefs.preferredEducationLevels?.includes(
                    candidate.educationLevel,
                )
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
                prefs.preferredAnnualIncomeRanges?.includes(
                    candidate.annualIncomeRange,
                )
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


        revalidatePath("/best-proposals");
        return {success: true, count: matchResults.length};
    } catch (error: any) {
        console.error("[MATCHING_ENGINE_ERROR]:", error);
        return {success: false, error: error.message};
    }
}