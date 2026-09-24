import {relations, sql} from "drizzle-orm";
import {
    pgTable,
    uuid,
    text,
    timestamp,
    date,
    varchar,
    pgSequence,
    boolean,
    integer,
    pgEnum,
    uniqueIndex, index, unique,
} from "drizzle-orm/pg-core";

export const profileSeq = pgSequence("profile_id_seq", {
    startWith: 1000,
    increment: 1,
});

export const roleEnum = pgEnum("app_role", ["user", "admin"]);
export const onboardingEnum = pgEnum("onboarding_status", [
    "INCOMPLETED",
    "COMPLETED",
]);

export const onboardingStepEnum = pgEnum("onboarding_step", [
    "START",
    "RELIGION",
    "ACHIEVEMENTS",
    "LOCATION",
    "PERSONAL",
    "HOBBIES",
    "PREFERENCES",
    "COMPLETED",
]);

export const userStatusEnum = pgEnum("user_status", ["active", "banned"]);
export const membershipEnum = pgEnum("membership_plan", [
    "free_tier",
    "classical",
    "heritage",
]);
export const profileStatusEnum = pgEnum("profile_status", [
    "pending",
    "approved",
    "rejected",
]);
export const invitationStatusEnum = pgEnum("invitation_status", [
    "pending",
    "accepted",
    "declined",
]);
export const verificationStatusEnum = pgEnum("verification_status", [
    "pending",
    "verified",
    "rejected",
]);
export const mailRoutingEnum = pgEnum("mail_routing", [
    "owner",
    "candidate",
    "both",
]);
export const maritalStatusEnum = pgEnum("marital_status", [
    "never_married",
    "divorced",
    "widowed",
]);

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "failed", "cancelled"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["inactive", "active", "expired"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name"),
    email: varchar("email", {length: 255}).notNull().unique(),
    role: roleEnum("app_role").default("user").notNull(),

    onboardingStatus: onboardingEnum("onboarding_status").default("INCOMPLETED"),
    onboardingStep: onboardingStepEnum("onboarding_step").default("START"),

    status: userStatusEnum("user_status").default("active").notNull(),
    membership: membershipEnum("membership_plan").default("free_tier"),
    // isVerified: boolean("is_verified").default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),

    packageId: integer("package_id").notNull(), // matches an id in lib/pricing-packages.ts
    packageName: text("package_name").notNull(), // snapshot at purchase time — pricing can change later without rewriting history
    amountCents: integer("amount_cents").notNull(), // snapshot, priced server-side, never from client input

    status: orderStatusEnum("status").default("pending").notNull(),
    paymentsLkCheckoutId: text("payments_lk_checkout_id"),

    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable(
    "subscriptions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),

        packageId: integer("package_id"),
        packageName: text("package_name"),
        status: subscriptionStatusEnum("status").default("inactive").notNull(),

        startedAt: timestamp("started_at"),
        expiresAt: timestamp("expires_at"),
        lastOrderId: uuid("last_order_id").references(() => orders.id),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userUnique: unique("subscriptions_user_id_unique").on(table.userId),
    }),
);

export const favorites = pgTable(
    "favorites",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        favoritedByProfileId: uuid("favorited_by_profile_id")
            .notNull()
            .references(() => profiles.id, {onDelete: "cascade"}),
        targetProfileId: uuid("target_profile_id")
            .notNull()
            .references(() => profiles.id, {onDelete: "cascade"}),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("unique_favorite_pair_idx").on(
            table.favoritedByProfileId,
            table.targetProfileId,
        ),
    ],
);

export const invitations = pgTable(
    "invitations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        senderProfileId: uuid("sender_profile_id")
            .notNull()
            .references(() => profiles.id, {onDelete: "cascade"}),
        receiverProfileId: uuid("receiver_profile_id")
            .notNull()
            .references(() => profiles.id, {onDelete: "cascade"}),
        status: invitationStatusEnum("status").default("pending").notNull(),
        message: text("message"), // Optional short introduction
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("unique_invitation_pair_idx").on(
            table.senderProfileId,
            table.receiverProfileId,
        ),
    ],
);

export const verifications = pgTable("verifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
        .notNull()
        .unique()
        .references(() => profiles.id, {onDelete: "cascade"}),
    idNumber: text("id_number").notNull(),
    documentFrontUrl: text("document_front_url").notNull(),
    documentBackUrl: text("document_back_url"),
    status: verificationStatusEnum("status").default("pending").notNull(),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    profileID: varchar("profile_id", {length: 20})
        .default(sql`concat('JV', nextval('profile_id_seq'))`)
        .notNull()
        .unique(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).unique(),
    createdBy: text("created_by"), // 'self' | 'parent' | 'guardian' | 'sibling' | 'friend' | 'admin'
    fullName: text("full_name"),
    contact: text("contact"),
    gender: text("gender"),
    profilePic: text("profile_pic"),
    dob: date("dob", {mode: "date"}),
    religion: text("religion"),
    caste: text("caste"),
    motherTongue: text("mother_tongue"),
    educationLevel: text("education_level"),
    profession: text("profession"),
    annualIncomeRange: text("annual_income_range"),
    country: text("country"),
    state: text("state"),
    city: text("city"),
    residencyStatus: text("residency_status"),
    maritalStatus: maritalStatusEnum("marital_status"),
    height: text("height_cm"),
    weight: text("weight_kg"),
    age: integer("age"),
    narrative: text("narrative"),
    smoking: text("smoking_habits"), // 'never' | 'occasionally' | 'regularly'
    drinking: text("drinking_habits"), // 'never' | 'occasionally' | 'regularly'
    foodPreferences: text("food_preferences"), // 'vegetarian' | 'non-vegetarian' | 'vegan'
    isDifferentlyAbled: boolean("is_differently_abled").default(false),
    differentlyAbledDetails: text("differently_abled_details"),
    hobbies: text("hobbies").array(),

    mailRoutingTarget: mailRoutingEnum("mail_routing_target").default("owner"),
    secondaryEmail: text("secondary_email"),

    status: profileStatusEnum("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    isVerified: boolean("is_verified").default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerPreferences = pgTable("partner_preferences", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).unique(),
    preferredMinAge: integer("preferred_min_age"),
    preferredMaxAge: integer("preferred_max_age"),
    preferredMaritalStatus: maritalStatusEnum("preferred_marital_status").default(
        "never_married",
    ),
    preferredEducationLevels: text("preferred_education_levels").array(),
    preferredProfessions: text("preferred_professions").array(),
    preferredAnnualIncomeRanges: text("preferred_annual_income_ranges").array(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profileMatches = pgTable("profile_matches", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    matchedProfileId: uuid("matched_profile_id").references(() => profiles.id, {onDelete: "cascade"}).notNull(),
    score: integer("score").notNull(), // Match percentage (0-100)
    matchReasons: text("match_reasons").array(), // e.g. ["Age Preference Met", "Education Match"]
    viewedAt: timestamp("viewed_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    // Prevents duplicate match entries for the same user pair
    userMatchIdx: uniqueIndex("user_match_idx").on(table.userId, table.matchedProfileId),
}));

export const profileViews = pgTable(
    "profile_views",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        viewerUserId: uuid("viewer_user_id")
            .references(() => users.id, {onDelete: "cascade"})
            .notNull(),
        viewedProfileId: uuid("viewed_profile_id")
            .references(() => profiles.id, {onDelete: "cascade"})
            .notNull(),
        viewedAt: timestamp("viewed_at").defaultNow().notNull(),
    },
    (table) => ({
        // Fast "how many people viewed my profile" / "who viewed me" lookups.
        viewedProfileIdx: index("profile_views_viewed_profile_idx").on(table.viewedProfileId),
        // Fast cooldown check: "did this viewer already view this profile recently?"
        viewerProfileIdx: index("profile_views_viewer_profile_idx").on(
            table.viewerUserId,
            table.viewedProfileId,
        ),
    }),
);

export const profileMatchesRelations = relations(profileMatches, ({one}) => ({
    matchedProfile: one(profiles, {
        fields: [profileMatches.matchedProfileId],
        references: [profiles.id],
    }),
    user: one(users, {
        fields: [profileMatches.userId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({many}) => ({
    profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({one}) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
}));

export const inquiries = pgTable("inquiries", {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: varchar("email", {length: 255}).notNull(),
    interest: text("interest").notNull(),
    message: text("message").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
