"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Clock, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { respondToInvitation } from "@/app/actions/invitation-actions";
import toast from "react-hot-toast";

interface CounterpartProfile {
    id: string;
    profileID: string;
    fullName: string | null;
    profilePic: string | null;
    age: number | null;
    profession: string | null;
    city: string | null;
    country: string | null;
    contact: string | null; // already stripped server-side unless accepted
}

interface InvitationCardProps {
    invitationId: string;
    status: "pending" | "accepted" | "declined";
    message: string | null;
    createdAt: string | Date;
    counterpart: CounterpartProfile;
    variant: "sent" | "received";
}

const statusConfig = {
    pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    accepted: { label: "Connected", className: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
    declined: { label: "Declined", className: "bg-slate-100 text-slate-500 border-slate-200", icon: XCircle },
} as const;

export default function InvitationCard({
                                           invitationId,
                                           status: initialStatus,
                                           message,
                                           createdAt,
                                           counterpart,
                                           variant,
                                       }: InvitationCardProps) {
    const [status, setStatus] = useState(initialStatus);
    const [contact, setContact] = useState(counterpart.contact);
    const [loadingAction, setLoadingAction] = useState<"accept" | "decline" | null>(null);

    const handleRespond = async (action: "accept" | "decline") => {
        setLoadingAction(action);
        try {
            const result = await respondToInvitation(invitationId, action);
            if (!result.success) {
                toast.error(result.error || "Something went wrong.");
                return;
            }
            setStatus(action === "accept" ? "accepted" : "declined");
            if (action === "accept") {
                setContact(result.data?.revealedContact ?? null);
                toast.success("Invitation accepted!");
            } else {
                toast.success("Invitation declined.");
            }
        } catch (error) {
            console.error("[INVITATION_RESPOND_ERROR]:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoadingAction(null);
        }
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;
    const location = [counterpart.city, counterpart.country].filter(Boolean).join(", ");

    return (
        <Card className="p-4">
            <CardContent className="p-0 flex flex-col sm:flex-row gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {counterpart.profilePic ? (
                        <Image
                            src={counterpart.profilePic}
                            alt={counterpart.fullName || counterpart.profileID}
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <User className="h-7 w-7 text-slate-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900">
                            {counterpart.fullName || counterpart.profileID}
                        </h4>
                        <Badge variant="outline" className={`gap-1 ${config.className}`}>
                            <StatusIcon size={13} />
                            {config.label}
                        </Badge>
                    </div>

                    <p className="text-sm text-slate-500 mt-0.5">
                        {counterpart.profileID}
                        {counterpart.age ? ` • ${counterpart.age} yrs` : ""}
                        {counterpart.profession ? ` • ${counterpart.profession}` : ""}
                    </p>
                    {location && <p className="text-xs text-slate-400 mt-0.5">{location}</p>}

                    {message && (
                        <p className="text-sm text-slate-600 italic mt-2 border-l-2 border-slate-200 pl-2">
                            "{message}"
                        </p>
                    )}

                    {status === "accepted" && contact && (
                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 w-fit">
                            <Phone size={15} />
                            {contact}
                        </div>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                        {variant === "sent" ? "Sent" : "Received"} {new Date(createdAt).toLocaleDateString()}
                    </p>

                    {variant === "received" && status === "pending" && (
                        <div className="flex gap-2 mt-3">
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={loadingAction !== null}
                                onClick={() => handleRespond("accept")}
                            >
                                {loadingAction === "accept" ? "Accepting..." : "Accept"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={loadingAction !== null}
                                onClick={() => handleRespond("decline")}
                            >
                                {loadingAction === "decline" ? "Declining..." : "Decline"}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}