import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import * as schema from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { fileURLToPath } from "url";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1, prepare: false });
const db = drizzle(client, { schema });
const { users, profiles } = schema;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("⏳ Starting profile table seeding process...");

  try {
    console.log("🧹 Clearing existing data from profiles and users...");
    await db.delete(profiles);
    await db.delete(users);
    console.log("✅ Existing data cleared successfully.");

    const filePath = path.join(__dirname, "profiles.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonProfiles = JSON.parse(rawData);

    console.log(
      `📦 Found ${jsonProfiles.length} template profiles. Remapping fields...`,
    );

    for (const p of jsonProfiles) {
      const mockUserEmail =
        p.email?.trim().toLowerCase() ||
        `${p.full_name.toLowerCase().replace(/\s+/g, "")}@example.com`;

      let userRecord = await db.query.users.findFirst({
        where: eq(users.email, mockUserEmail),
      });

      if (!userRecord) {
        const newUserId = crypto.randomUUID();
        await db.insert(users).values({
          id: newUserId,
          fullName: p.full_name,
          email: mockUserEmail,
          onboardingStatus: "COMPLETED",
          onboardingStep: "COMPLETED",
        });

        userRecord = await db.query.users.findFirst({
          where: eq(users.email, mockUserEmail),
        });
      }

      if (!userRecord) {
        throw new Error(
          `Failed to create or retrieve user record for ${mockUserEmail}`,
        );
      }

      await db
        .insert(profiles)
        .values({
          id: crypto.randomUUID(),
          userId: userRecord.id,
          createdBy: p.created_by,
          fullName: p.full_name,
          contact: p.contact,
          gender: p.gender,
          profilePic: p.profile_pic,
          dob: new Date(p.dob),
          religion: p.religion,
          caste: p.caste,
          motherTongue: p.mother_tongue,
          educationLevel: p.education_level,
          profession: p.profession,
          annualIncomeRange: p.annual_income_range,
          country: p.country,
          state: p.state,
          city: p.city,
          residencyStatus: p.residency_status,
          height: p.height_cm,
          weight: p.weight_kg,
          age: p.age,
          narrative: p.narrative,
          smoking: p.smoking_habits,
          drinking: p.drinking_habits,
          foodPreferences: p.food_preferences,
          isDifferentlyAbled: p.is_differently_abled || false,
          differentlyAbledDetails: p.differently_abled_details,
          hobbies: p.hobbies || [],
          mailRoutingTarget: p.mail_routing_target || "owner",
          secondaryEmail: p.secondary_email || null,
          status: p.status || "pending",
        })
        .returning({ generatedProfileId: profiles.profileID });
    }

    console.log("🚀 Inserting match profiles into database...");

    console.log(
      "✨ Seeding completed successfully! You can now test your matching queries.",
    );
  } catch (error) {
    console.error("❌ Seeding transaction execution failed:", error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();
