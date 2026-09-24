const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME || "Jeevana Matrimony";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support.jeevana@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

interface InvitationReceivedParams {
    recipientName: string;
    recipientProfileID: string;
    senderProfileID: string;
    senderAge: number | null;
    senderProfession: string | null;
    senderCity: string | null;
    senderCountry: string | null;
    matchScore: number | null; // omit the line entirely if null
    invitationId: string;
    personalMessage: string | null;
}

export function invitationReceivedEmail(params: InvitationReceivedParams) {
    const {
        recipientName,
        recipientProfileID,
        senderProfileID,
        senderAge,
        senderProfession,
        senderCity,
        senderCountry,
        matchScore,
        invitationId,
        personalMessage,
    } = params;

    const respondUrl = `${APP_URL}/my-dashboard/invitations/received?highlight=${invitationId}`;

    const location = [senderCity, senderCountry].filter(Boolean).join(", ");

    return {
        subject: `You Have a New Interest Notification – ${PLATFORM_NAME}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
        <p>Dear ${recipientName},</p>
        <p>
          We are pleased to inform you that a fellow member on ${PLATFORM_NAME} has shown
          interest in your profile (${recipientProfileID}) and would like to connect with you.
        </p>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin:20px 0;">
          <p style="margin:4px 0;"><strong>Profile ID:</strong> ${senderProfileID}</p>
          ${senderAge ? `<p style="margin:4px 0;"><strong>Age:</strong> ${senderAge}</p>` : ""}
          ${senderProfession ? `<p style="margin:4px 0;"><strong>Profession:</strong> ${senderProfession}</p>` : ""}
          ${location ? `<p style="margin:4px 0;"><strong>Location:</strong> ${location}</p>` : ""}
          ${matchScore != null ? `<p style="margin:4px 0;"><strong>Compatibility Score:</strong> ${matchScore}%</p>` : ""}
        </div>
        ${personalMessage ? `<p style="font-style:italic; color:#475569;">"${personalMessage}"</p>` : ""}
        <p style="text-align:center; margin: 28px 0;">
          <a href="${respondUrl}" style="background:#7c3aed; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:600;">
            View Full Profile &amp; Respond
          </a>
        </p>
        <p>
          You're welcome to Accept or Decline at your convenience — there's no obligation
          either way. Your contact details remain private and will only be shared if you
          choose to accept.
        </p>
        <p style="font-size: 13px; color:#64748b;">
          If you did not expect this notification, you can safely disregard this email,
          or reach us at ${SUPPORT_EMAIL}.
        </p>
        <p>Warm regards,<br/>The ${PLATFORM_NAME} Team</p>
      </div>
    `,
    };
}

interface InvitationOutcomeParams {
    senderName: string;
    recipientProfileID: string;
    outcome: "accepted" | "declined";
}

export function invitationOutcomeEmail(params: InvitationOutcomeParams) {
    const { senderName, recipientProfileID, outcome } = params;
    const dashboardUrl = `${APP_URL}/my-dashboard/invitations/sent`;

    if (outcome === "accepted") {
        return {
            subject: `Good News — Your Invitation Was Accepted – ${PLATFORM_NAME}`,
            html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
          <p>Dear ${senderName},</p>
          <p>
            Good news — <strong>${recipientProfileID}</strong> has accepted your invitation
            to connect on ${PLATFORM_NAME}.
          </p>
          <p style="text-align:center; margin: 28px 0;">
            <a href="${dashboardUrl}" style="background:#16a34a; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:600;">
              View Contact Details
            </a>
          </p>
          <p>Warm regards,<br/>The ${PLATFORM_NAME} Team</p>
        </div>
      `,
        };
    }

    return {
        subject: `Update on Your Invitation – ${PLATFORM_NAME}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
        <p>Dear ${senderName},</p>
        <p>
          Thank you for your interest. <strong>${recipientProfileID}</strong> was unable to
          accept your invitation at this time. We encourage you to continue exploring other
          matching profiles on ${PLATFORM_NAME}.
        </p>
        <p style="text-align:center; margin: 28px 0;">
          <a href="${APP_URL}/my-dashboard/best-proposals" style="background:#7c3aed; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:600;">
            View More Matches
          </a>
        </p>
        <p>Warm regards,<br/>The ${PLATFORM_NAME} Team</p>
      </div>
    `,
    };
}