"use server";

import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { SearchFilters } from "@/types";

const targetGenderMap: Record<string, string> = {
  bride: "FEMALE",
  groom: "MALE",
  female: "FEMALE",
  male: "MALE",
};

export async function getProfilesByFilters(filters: SearchFilters) {
  try {
    const { minAge, maxAge } = filters;

    const rawLookingFor = String(filters.lookingFor || "")
      .trim()
      .toLowerCase();
    const targetGender = targetGenderMap[rawLookingFor] || undefined;
    const rawReligion = String(filters.religion || "").trim();
    const rawCaste = String(filters.caste || "").trim();
    const rawMotherTongue = String(filters.motherTongue || "").trim();
    const rawEducationLevel = String(filters.educationLevel || "").trim();
    const rawProfession = String(filters.profession || "").trim();
    const rawIncomeRange = String(filters.annualIncomeRange || "").trim();
    const rawCountry = String(filters.country || "").trim();
    const rawState = String(filters.state || "").trim();

    const parsedMinAge = minAge ? parseInt(minAge, 10) : 18;
    const parsedMaxAge = maxAge ? parseInt(maxAge, 10) : 100;

    // console.log("[SERVER_ACTION_FETCH]: Executing lookup for", {
    //   rawLookingFor,
    //   rawReligion,
    //   rawCaste,
    //   rawMotherTongue,
    //   rawEducationLevel,
    //   rawProfession,
    //   rawIncomeRange,
    //   rawCountry,
    //   rawState,
    //   parsedMinAge,
    //   parsedMaxAge,
    // });

    const conditions = [
      gte(profiles.age, parsedMinAge),
      lte(profiles.age, parsedMaxAge),
    ];

    if (targetGender) {
      conditions.push(eq(profiles.gender, targetGender));
    }
    if (rawReligion) {
      conditions.push(eq(profiles.religion, rawReligion));
    }
    if (rawCaste) {
      conditions.push(eq(profiles.caste, rawCaste));
    }
    if (rawMotherTongue) {
      conditions.push(eq(profiles.motherTongue, rawMotherTongue));
    }
    if (rawEducationLevel) {
      conditions.push(eq(profiles.educationLevel, rawEducationLevel));
    }
    if (rawProfession) {
      conditions.push(eq(profiles.profession, rawProfession));
    }
    if (rawIncomeRange) {
      conditions.push(eq(profiles.annualIncomeRange, rawIncomeRange));
    }
    if (rawCountry) {
      conditions.push(eq(profiles.country, rawCountry));
    }
    if (rawState) {
      conditions.push(eq(profiles.state, rawState));
    }

    const searchedProfiles = await db
      .select()
      .from(profiles)
      .where(and(...conditions))
      .orderBy(desc(profiles.createdAt))
      .limit(5);

    return { success: true, data: searchedProfiles };
  } catch (error) {
    console.error("[DATABASE_SEARCH_CRASH]:", error);
    return { success: false, data: [], error: "Failed to retrieve profiles." };
  }
}
