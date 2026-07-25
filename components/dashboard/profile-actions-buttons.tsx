"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { approveProfile, rejectProfile } from "@/app/actions/profile-actions";
import toast from "react-hot-toast";
import { ProfileStatusTypes } from "@/types";

export function ProfileActionsButtons({
    profileId,
    status,
}: {
    profileId: string;
    status: ProfileStatusTypes;
}) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (type: "approve" | "reject") => {
        startTransition(async () => {
            const result =
                type === "approve"
                    ? await approveProfile(profileId)
                    : await rejectProfile(profileId);

            if (type === "approve" && result.success) {
                toast.success("Profile successfully approved!");
            } else {
                toast.error("Profile rejected!");
            }
        });
    };

    return (
        <div className="flex items-center gap-4 mt-6">
            {status === "pending" ? (
                <>
                    <Button
                        variant="approved"
                        disabled={isPending}
                        onClick={() => handleAction("approve")}
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4 mr-2" />
                        )}
                        Approve
                    </Button>

                    <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleAction("reject")}
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <X className="w-4 h-4 mr-2" />
                        )}
                        Reject
                    </Button>
                </>
            ) : null}
        </div>
    );
}
