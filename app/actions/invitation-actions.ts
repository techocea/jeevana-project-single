"use server";

import { db } from "@/lib/db";
import { invitations, profiles, profileMatches } from "@/drizzle/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { getCurrentUser } from "@/app/actions/profile-actions";
import { sendMail } from "@/lib/mailer";
import { invitationReceivedEmail, invitationOutcomeEmail } from "@/lib/invitation-email-templates";

async function getOwnProfile(userId: string) {
    return db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
}

/**
 * Isolated on purpose — this is the ONE place that decides whether contact
 * info can be shown. Today it only checks invitation acceptance. When the
 * paid "view up to N contacts" quota feature is built, that check gets
 * added here as an OR condition — nothing else in this file needs to change.
 */
function canViewContact(invitationStatus: string): boolean {
    return invitationStatus === "accepted";
}

export async function sendInvitation(receiverProfileId: string, message?: string) {
    try {
        const { success, data: currentUser } = await getCurrentUser();
        if (!success || !currentUser) {
            return { success: false, error: "Unauthorized" };
        }

        const senderProfile = await getOwnProfile(currentUser.id);
        if (!senderProfile || senderProfile.status !== "approved") {
            return { success: false, error: "Your profile must be approved before sending invitations." };
        }

        const receiverProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, receiverProfileId),
        });

        if (!receiverProfile || receiverProfile.status !== "approved") {
            return { success: false, error: "This profile is not available." };
        }

        if (receiverProfile.id === senderProfile.id) {
            return { success: false, error: "You cannot send an invitation to yourself." };
        }

        if (senderProfile.gender && receiverProfile.gender && senderProfile.gender === receiverProfile.gender) {
            return { success: false, error: "This profile is not eligible to receive an invitation from you." };
        }

        const existing = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.senderProfileId, senderProfile.id),
                eq(invitations.receiverProfileId, receiverProfile.id),
            ),
        });

        if (existing) {
            return { success: false, error: "You've already sent an invitation to this profile." };
        }

        const [invitation] = await db
            .insert(invitations)
            .values({
                senderProfileId: senderProfile.id,
                receiverProfileId: receiverProfile.id,
                message: message || null,
            })
            .returning();

        // Best-effort match score, if one has been computed for this pair — the
        // email just omits the line if not found rather than failing.
        const match = await db.query.profileMatches.findFirst({
            where: and(
                eq(profileMatches.userId, currentUser.id),
                eq(profileMatches.matchedProfileId, receiverProfile.id),
            ),
        });

        // Route to the profile owner's own account email, or a secondary
        // contact, per the profile's own mailRoutingTarget setting.
        const recipientEmails = await resolveRecipientEmails(receiverProfile);

        const { subject, html } = invitationReceivedEmail({
            recipientName: receiverProfile.fullName || "there",
            recipientProfileID: receiverProfile.profileID,
            senderProfileID: senderProfile.profileID,
            senderAge: senderProfile.age,
            senderProfession: senderProfile.profession,
            senderCity: senderProfile.city,
            senderCountry: senderProfile.country,
            matchScore: match?.score ?? null,
            invitationId: invitation.id,
            personalMessage: message || null,
        });

        for (const to of recipientEmails) {
            await sendMail({ to, subject, html });
        }

        return { success: true, data: invitation };
    } catch (error: any) {
        console.error("[SEND_INVITATION_CRASH]:", error);
        return { success: false, error: error.message || "Failed to send invitation." };
    }
}

export async function respondToInvitation(invitationId: string, action: "accept" | "decline") {
    try {
        const { success, data: currentUser } = await getCurrentUser();
        if (!success || !currentUser) {
            return { success: false, error: "Unauthorized" };
        }

        const receiverProfile = await getOwnProfile(currentUser.id);
        if (!receiverProfile) {
            return { success: false, error: "Profile not found." };
        }

        const invitation = await db.query.invitations.findFirst({
            where: eq(invitations.id, invitationId),
        });

        if (!invitation) {
            return { success: false, error: "Invitation not found." };
        }

        if (invitation.receiverProfileId !== receiverProfile.id) {
            return { success: false, error: "You do not have access to this invitation." };
        }

        if (invitation.status !== "pending") {
            return { success: false, error: "This invitation has already been responded to." };
        }

        const newStatus = action === "accept" ? "accepted" : "declined";

        const [updated] = await db
            .update(invitations)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(invitations.id, invitationId))
            .returning();

        const senderProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, invitation.senderProfileId),
        });

        if (senderProfile) {
            const senderEmails = await resolveRecipientEmails(senderProfile);
            const { subject, html } = invitationOutcomeEmail({
                senderName: senderProfile.fullName || "there",
                recipientProfileID: receiverProfile.profileID,
                outcome: newStatus,
            });

            for (const to of senderEmails) {
                await sendMail({ to, subject, html });
            }
        }

        return {
            success: true,
            data: {
                ...updated,
                revealedContact: newStatus === "accepted" ? senderProfile?.contact ?? null : null,
            },
        };
    } catch (error: any) {
        console.error("[RESPOND_TO_INVITATION_CRASH]:", error);
        return { success: false, error: error.message || "Failed to respond to invitation." };
    }
}


export async function getSentInvitations() {
    const { success, data: currentUser } = await getCurrentUser();
    if (!success || !currentUser) return { success: false, error: "Unauthorized" };

    const myProfile = await getOwnProfile(currentUser.id);
    if (!myProfile) return { success: false, error: "Profile not found." };

    const rows = await db
        .select({
            invitationId: invitations.id,
            status: invitations.status,
            message: invitations.message,
            createdAt: invitations.createdAt,
            counterpart: profiles,
        })
        .from(invitations)
        .innerJoin(profiles, eq(profiles.id, invitations.receiverProfileId))
        .where(eq(invitations.senderProfileId, myProfile.id))
        .orderBy(desc(invitations.createdAt));

    // Strip contact info server-side unless accepted — never rely on the UI
    // to hide a field that's already sitting in the response payload.
    const data = rows.map((row) => ({
        ...row,
        counterpart: {
            ...row.counterpart,
            contact: canViewContact(row.status) ? row.counterpart.contact : null,
        },
    }));

    return { success: true, data };
}

export async function getReceivedInvitations() {
    const { success, data: currentUser } = await getCurrentUser();
    if (!success || !currentUser) return { success: false, error: "Unauthorized" };

    const myProfile = await getOwnProfile(currentUser.id);
    if (!myProfile) return { success: false, error: "Profile not found." };

    const rows = await db
        .select({
            invitationId: invitations.id,
            status: invitations.status,
            message: invitations.message,
            createdAt: invitations.createdAt,
            counterpart: profiles,
        })
        .from(invitations)
        .innerJoin(profiles, eq(profiles.id, invitations.senderProfileId))
        .where(eq(invitations.receiverProfileId, myProfile.id))
        .orderBy(desc(invitations.createdAt));

    const data = rows.map((row) => ({
        ...row,
        counterpart: {
            ...row.counterpart,
            contact: canViewContact(row.status) ? row.counterpart.contact : null,
        },
    }));

    return { success: true, data };
}

/* ------------------------------------------------------------------ */
/* Mail routing helper — reuses profiles.mailRoutingTarget/secondaryEmail */
/* ------------------------------------------------------------------ */
async function resolveRecipientEmails(profile: typeof profiles.$inferSelect): Promise<string[]> {
    const emails: string[] = [];

    const owner = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, profile.userId!) });

    if ((profile.mailRoutingTarget === "owner" || profile.mailRoutingTarget === "both") && owner?.email) {
        emails.push(owner.email);
    }
    if (
        (profile.mailRoutingTarget === "candidate" || profile.mailRoutingTarget === "both") &&
        profile.secondaryEmail
    ) {
        emails.push(profile.secondaryEmail);
    }

    // Fallback: if routing produced nothing (misconfigured), don't silently
    // drop the notification — fall back to the owner's account email.
    if (emails.length === 0 && owner?.email) {
        emails.push(owner.email);
    }

    return emails;
}