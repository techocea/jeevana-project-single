import { getReceivedInvitations } from "@/app/actions/invitation-actions";
import InvitationCard from "@/components/dashboard/invitation-card";
import { Inbox } from "lucide-react";

export default async function ReceivedInvitationsPage() {
    const result = await getReceivedInvitations();
    const invitations = result.success ? result.data ?? [] : [];

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Received Invitations</h1>
                <p className="text-sm text-slate-500 mt-1">
                    People who have expressed interest in connecting with you.
                </p>
            </div>

            {!result.success && (
                <p className="text-sm text-red-600">{result.error || "Failed to load invitations."}</p>
            )}

            {result.success && invitations.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg">
                    <Inbox className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No invitations received yet.</p>
                </div>
            )}

            <div className="space-y-4">
                {invitations.map((inv) => (
                    <InvitationCard
                        key={inv.invitationId}
                        invitationId={inv.invitationId}
                        status={inv.status as "pending" | "accepted" | "declined"}
                        message={inv.message}
                        createdAt={inv.createdAt}
                        counterpart={inv.counterpart}
                        variant="received"
                    />
                ))}
            </div>
        </div>
    );
}