import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587/other
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface SendMailInput {
    to: string;
    subject: string;
    html: string;
}

/**
 * Single choke point for all outbound mail. When you swap to Resend later,
 * only this function's internals change — every call site (invitation
 * emails, future notification emails, etc.) stays the same.
 */
export async function sendMail({ to, subject, html }: SendMailInput) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error: any) {
        console.error("[SEND_MAIL_FAILURE]:", error);
        return { success: false, error: error.message || "Failed to send email." };
    }
}