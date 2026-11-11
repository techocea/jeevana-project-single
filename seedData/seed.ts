import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import * as schema from "@/drizzle/schema";
import {eq} from "drizzle-orm";
import {fileURLToPath} from "url";
import {getSupabaseAdmin} from "@/utils/supabase-admin";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, {max: 1, prepare: false});

const db = drizzle(client, {schema});
const {users, profiles, partnerPreferences} = schema;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("⏳ Starting profile table seeding process...");

    try {
        console.log("🧹 Clearing existing data from profiles and users...");
        await db.delete(partnerPreferences);
        await db.delete(profiles);
        await db.delete(users);
        console.log("✅ Existing data cleared successfully.");

        const profilesPath = path.join(__dirname, "profiles.json");
        const jsonProfiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));

        const preferencesPath = path.join(__dirname, "preferences.json");
        const jsonPreferences = JSON.parse(
            fs.readFileSync(preferencesPath, "utf-8"),
        );

        console.log(
            `📦 Found ${jsonProfiles.length} template profiles. Remapping and seeding...`,
        );

        const supabaseAdmin = getSupabaseAdmin();
        const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUsers = authUsersData?.users || [];

        for (let i = 0; i < jsonProfiles.length; i++) {
            const p = jsonProfiles[i];
            const mockUserEmail = p.email?.trim().toLowerCase();

            // 1. Resolve or provision the user in Supabase Auth (auth.users)
            let authUserId: string;
            const existingAuthUser = existingAuthUsers.find(
                (u) => u.email?.toLowerCase() === mockUserEmail,
            );

            if (existingAuthUser) {
                authUserId = existingAuthUser.id;
                await supabaseAdmin.auth.admin.updateUserById(authUserId, {
                    password: p.password || "Demo@123456",
                    email_confirm: true,
                    user_metadata: {
                        full_name: p.full_name,
                        role: "user",
                    },
                });
            } else {
                const { data: newAuthData, error: createAuthError } =
                    await supabaseAdmin.auth.admin.createUser({
                        email: mockUserEmail,
                        password: p.password || "Demo@123456",
                        email_confirm: true,
                        user_metadata: {
                            full_name: p.full_name,
                            role: "user",
                        },
                    });

                if (createAuthError || !newAuthData.user) {
                    throw new Error(
                        `Failed to create Supabase Auth user for ${mockUserEmail}: ${createAuthError?.message}`,
                    );
                }
                authUserId = newAuthData.user.id;
            }

            // 2. Ensure public.users record uses the exact same authUserId
            let userRecord = await db.query.users.findFirst({
                where: eq(users.id, authUserId),
            });

            if (!userRecord) {
                // Delete any orphaned record with this email but different id
                await db.delete(users).where(eq(users.email, mockUserEmail));

                await db.insert(users).values({
                    id: authUserId,
                    fullName: p.full_name,
                    email: mockUserEmail,
                    onboardingStatus: "COMPLETED",
                    onboardingStep: "COMPLETED",
                });

                userRecord = await db.query.users.findFirst({
                    where: eq(users.id, authUserId),
                });
            }

            if (!userRecord) {
                throw new Error(
                    `Fatal: Failed to establish or resolve User Record context for: ${mockUserEmail}`,
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
                    maritalStatus: p.marital_status || "single",
                    profilePic: p.profile_pic,
                    photoVisible: p.photo_visible !== undefined ? p.photo_visible : true,
                    dob: new Date(p.dob),
                    religion: p.religion,
                    caste: p.caste,
                    subCaste: p.sub_caste || null,
                    motherTongue: p.mother_tongue,
                    educationLevel: p.education_level,
                    educationDescription: p.education_description || null,
                    profession: p.profession,
                    employedIn: p.employed_in || "Private Corporate",
                    annualIncomeRange: p.annual_income_range,
                    country: p.country,
                    state: p.state,
                    city: p.city,
                    residencyStatus: p.residency_status,
                    height: p.height_cm,
                    weight: p.weight_kg,
                    complexion: p.complexion || "fair",
                    bodyType: p.body_type || "slim",
                    bloodGroup: p.blood_group || "O+",
                    narrative: p.narrative,
                    smoking: p.smoking_habits,
                    drinking: p.drinking_habits,
                    foodPreferences: p.food_preferences,
                    isDifferentlyAbled: p.is_differently_abled || false,
                    differentlyAbledDetails: p.differently_abled_details,
                    hobbies: p.hobbies || [],
                    mailRoutingTarget: p.mail_routing_target || "owner",
                    secondaryEmail: p.secondary_email || null,
                    status: p.status || "approved",
                })
                .returning({generatedProfileId: profiles.profileID});

            const matchedPref = jsonPreferences[i];

            if (matchedPref) {
                await db.insert(partnerPreferences).values({
                    id: crypto.randomUUID(),
                    userId: userRecord.id,
                    preferredMinAge: matchedPref.preferred_min_age ?? matchedPref.min_age,
                    preferredMaxAge: matchedPref.preferred_max_age ?? matchedPref.max_age,
                    preferredMinHeight: matchedPref.preferred_min_height || null,
                    preferredMaxHeight: matchedPref.preferred_max_height || null,
                    preferredReligions: matchedPref.preferred_religions || [],
                    preferredCastes: matchedPref.preferred_castes || [],
                    preferredMaritalStatuses: matchedPref.preferred_marital_statuses ?? matchedPref.marital_status ?? matchedPref.preferred_marital_status ?? "single",
                    preferredEducationLevels: matchedPref.preferred_education_levels || [],
                    preferredProfessions: matchedPref.preferred_professions || [],
                    preferredAnnualIncomeRanges: matchedPref.preferred_annual_income_ranges || [],
                    preferredResidencyStatuses: matchedPref.preferred_residency_statuses || ["CITIZEN"],
                });
            }

            console.log(
                `✅ Fully seeded: Profile and preferences context for [${p.full_name}]`,
            );
        }

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
