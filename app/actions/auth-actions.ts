"use server";

import {z} from "zod";
import {
    authLoginSchema,
    authRegisterSchema,
    createUserByAdminSchema,
    CreateUserByAdminValues,
    forgotPasswordSchema,
    type AuthLoginValues,
    type AuthRegisterValues,
    type ForgotPasswordValues,
} from "@/lib/validation";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {users} from "@/drizzle/schema";
import {createClient} from "@/utils/supabase";
import {getSupabaseAdmin} from "@/utils/supabase-admin";
import {redirect} from "next/navigation";
import {AppRole} from "@/lib/constants";

export async function sendPhoneOtp(formData: FormData) {
    const supabase = await createClient();
    const phoneNumber = formData.get("phoneNumber") as string;

    if (!phoneNumber) {
        return {success: false, error: "Phone number is required"};
    }

    // Ensure phoneNumber includes country code (e.g., +94771234567)
    const {error} = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
    });

    if (error) {
        return {success: false, error: error.message};
    }

    return {success: true};
}

export async function verifyPhoneOtp(phoneNumber: string, token: string) {
    const supabase = await createClient();

    if (!phoneNumber || !token) {
        return {success: false, error: "Missing required fields"};
    }

    const {data: authData, error: authError} = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: token,
        type: "sms", // Use 'sms' for standard phone registration/login
    });

    if (authError || !authData.user) {
        return {error: authError?.message || "Registration failed."};
    }

    try {
        await db.insert(users).values({
            id: authData.user.id,
            fullName: "",
            email: "",
            onboardingStatus: "INCOMPLETED",
            onboardingStep: "START",
        });
    } catch (error: any) {
        console.error("[DRIZZLE_REGISTRATION_MIRROR_FAILURE]:", error);

        return {
            error:
                "Account initialization failed. If this persists, your email might already be registered.",
        };
    }

    return {success: true, user: authData.user};
}

export async function loginAdmin(data: AuthLoginValues) {
    const parsed = authLoginSchema.safeParse(data);

    if (!parsed.success) {
        return {
            succes: false,
            error: "Validation failed",
            fields: z.treeifyError(parsed.error).errors,
        };
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const supabase = await createClient();

    const {data: authData, error: authError} =
        await supabase.auth.signInWithPassword({email, password});

    if (authError || !authData.user) {
        console.error("loginAdmin failed:", authError?.message);
        return {success: false, error: "Invalid admin email or password."};
    }


    const role = authData.user.app_metadata?.role as AppRole | undefined;
    const allowedRoles: AppRole[] = ["admin", "staff"];


    if (!role || !allowedRoles.includes(role)) {
        await supabase.auth.signOut();
        return {success: false, error: "Access denied. Administrative privileges required."};
    }

    redirect("/control-panel");

}

export async function registerUser(data: AuthRegisterValues) {
    const parsed = authRegisterSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: "Validation failed",
            fields: z.treeifyError(parsed.error).errors,
        };
    }

    const email = parsed.data.email.trim().toLowerCase();
    const fullName = parsed.data.fullName.trim();
    const password = parsed.data.password;

    const supabase = await createClient();

    const {data: authData, error: authError} = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError || !authData.user) {
        return {error: authError?.message || "Registration failed."};
    }

    try {
        await db.insert(users).values({
            id: authData.user.id,
            fullName,
            email,
            onboardingStatus: "INCOMPLETED",
            onboardingStep: "START",
        });
    } catch (error: any) {
        console.error("[DRIZZLE_REGISTRATION_MIRROR_FAILURE]:", error);

        return {
            error:
                "Account initialization failed. If this persists, your email might already be registered.",
        };
    }
    return {
        success: true,
        // Pass this boolean flag back so your client UI knows if it needs to say
        // "Check your email!" or if it can auto-login/redirect.
        emailVerificationRequired: authData.session === null,
    };
}

export async function loginUser(data: AuthLoginValues) {
    const parsed = authLoginSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: "Validation failed",
            fields: z.treeifyError(parsed.error).errors,
        };
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const supabase = await createClient();

    const {data: authData, error: authError} =
        await supabase.auth.signInWithPassword({email, password});

    if (authError || !authData.user) {
        console.error("[LOGIN_AUTH_FAILURE]:", authError?.message, authError?.code);
        return {error: "User not registered."};
    }

    await supabase.auth.refreshSession();
    let dbUser;
    try {
        const [fetchedUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, authData.user.id))
            .limit(1);

        dbUser = fetchedUser;
    } catch (error) {
        console.error("[DATABASE_READ_FAILURE]:", error);
        return {error: "A secure connection error occurred. Please try again."};
    }

    let targetRoute = "/my-dashboard";

    if (
        !dbUser ||
        dbUser.role === "user" ||
        dbUser.onboardingStatus === "INCOMPLETED"
    ) {
        targetRoute = "/onboarding";
    }

    return {
        success: true,
        targetRoute,
    };
}

export async function requestPasswordReset(data: ForgotPasswordValues) {
    const parsed = forgotPasswordSchema.safeParse(data);

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const error = new Error("Validation failed");
        (error as any).validation = errors;
        throw error;
    }

    const email = parsed.data.email.trim().toLowerCase();

    const found = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return {
        success: true,
        emailSent: found.length > 0,
    };
}

export async function createUserByAdmin(data: CreateUserByAdminValues) {
    try {
        const supabase = await createClient();
        const {
            data: {user: currentUser},
        } = await supabase.auth.getUser();

        if (!currentUser) {
            return {error: "Unauthorized access."};
        }

        const metadataRole =
            currentUser.user_metadata?.role;

        let dbRole: string | undefined = undefined;

        if (!metadataRole) {
            const caller = await db.query.users.findFirst({
                where: (u, {eq}) => eq(u.id, currentUser.id),
            });
            dbRole = caller?.role;
        }
        const effectiveRole = (metadataRole || dbRole || "").toLowerCase();

        if (effectiveRole !== "admin") {
            return {error: "Forbidden: Admin privileges required."};
        }

        const parsed = createUserByAdminSchema.safeParse(data);
        if (!parsed.success) {
            return {
                error: "Validation failed",
                fields: z.treeifyError(parsed.error).errors,
            };
        }

        const {email, fullName, password, role, emailConfirm} = parsed.data;
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = fullName.trim();

        const {data: authData, error: authError} =
            await getSupabaseAdmin().auth.admin.createUser({
                email: cleanEmail,
                password,
                email_confirm: emailConfirm, // Marks email as verified immediately
                user_metadata: {
                    full_name: cleanName,
                    role,
                },
            });

        if (authError || !authData.user) {
            return {
                error: authError?.message || "Failed to create user in Auth system.",
            };
        }

        const newUserId = authData.user.id;
        await db.insert(users).values({
            id: newUserId,
            fullName: cleanName,
            email: cleanEmail,
            role,
            onboardingStatus: "COMPLETED",
            onboardingStep: "COMPLETED",
        });

        return {
            success: true,
            message: "User created successfully",
            user: {
                id: newUserId,
                email: cleanEmail,
                fullName: cleanName,
            },
        };
    } catch (error: any) {
        console.error("[ADMIN_WORKFLOW_PROVISION_CRASH]:", error);
        // await supabaseAdmin.auth.admin.deleteUser(newUserId);
        return {
            success: false,
            error: error.message || "Failed to initialize user record.",
        };
    }
}
