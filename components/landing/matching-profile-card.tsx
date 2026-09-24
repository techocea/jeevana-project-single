"use client";

import Image from "next/image";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    MapPin,
    Briefcase,
    GraduationCap,
    Sparkles,
    Check,
    UserPlus,
    Mail,
    Heart,
    Loader2,
    ChevronRight,
    User, Eye, CheckCircle2,
} from "lucide-react";
import {getScoreBadgeStyle} from "@/helpers/get-status-badge";
import {useEffect, useState, useTransition} from "react";
import {addProfileToFavorite} from "@/app/actions/profile-actions";
import toast from "react-hot-toast";
import {Label} from "../ui/label";
import {sendInvitation} from "@/app/actions/invitation-actions";

interface ProfileData {
    id: string;
    fullName: string | null;
    age: number | null;
    gender: string | null;
    profession: string | null;
    educationLevel: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    profilePic: string | null;
    isFavorited?: boolean;
    height: string | null;
}

interface ProfileMatchItem {
    id: string;
    score: number;
    matchReasons: string[] | null;
    matchedProfile: ProfileData;
}

interface MatchingProfileCardProps {
    match: ProfileMatchItem;
    // currentProfileId: string;
}

const MatchingProfileCard = ({match}: MatchingProfileCardProps) => {
    const {id, score, matchReasons, matchedProfile} = match;
    const [isSending, setIsSending] = useState(false);
    const [invitationSent, setInvitationSent] = useState(false);

    const handleSendInterest = async () => {
        if (isSending || invitationSent) return;

        setIsSending(true);
        try {
            const result = await sendInvitation(matchedProfile.id);

            if (!result.success) {
                if (result.error?.toLowerCase().includes("already sent")) {
                    setInvitationSent(true);
                    toast("You've already sent an interest to this profile.", { icon: "ℹ️" });
                    return;
                }
                toast.error(result.error || "Couldn't send interest. Please try again.");
                return;
            }

            setInvitationSent(true);
            toast.success(`Interest sent to ${matchedProfile.fullName || "this profile"}.`);
        } catch (error) {
            console.error("[SEND_INTEREST_ERROR]:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const locationStr = [matchedProfile.city, matchedProfile.country]
        .filter(Boolean)
        .join(", ");

    const subStats = [
        matchedProfile.age ? `${matchedProfile.age} yrs` : null,
        matchedProfile.height ? `${matchedProfile.height} cm` : null,
    ]
        .filter(Boolean)
        .join(" • ");

    return (
        <Card
            className="group relative w-full max-w-sm overflow-hidden rounded-xl pb-4 pt-0 border border-muted-foreground/50 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">

            <div
                className="relative aspect-[16/11] w-full overflow-hidden rounded-xl rounded-bl-none rounded-br-none bg-slate-100 dark:bg-slate-800">
                {matchedProfile.profilePic ? (
                    <Image
                        src={matchedProfile.profilePic}
                        alt={matchedProfile.fullName || "Profile image"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-primary">
                        <User className="h-14 w-14 stroke-[1.5]"/>
                    </div>
                )}

                {/* Top-Right Overlapping Score Pill Badge */}
                <Badge
                    className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1 text-xs font-bold shadow-md border backdrop-blur-md ${getScoreBadgeStyle(score)}`}
                >
                    <span>{score}% Match</span>
                </Badge>
            </div>

            {/* Centered Primary Profile Info */}
            <CardContent className="px-5 space-y-4">
                <div className="text-center space-y-1">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white line-clamp-1">
                        {matchedProfile.fullName || "Anonymous Member"}
                    </h3>

                    {subStats && (
                        <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                            {subStats}
                        </p>
                    )}

                    {locationStr && (
                        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 pt-0.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-500"/>
                            <span className="truncate">{locationStr}</span>
                        </p>
                    )}
                </div>

                {/* Attribute Highlights (Profession & Education) */}
                <div
                    className="space-y-2 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs">
                    {matchedProfile.profession && (
                        <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400 shrink-0">
                <Briefcase className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300"/>
                Profession
              </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right line-clamp-1">
                {matchedProfile.profession}
              </span>
                        </div>
                    )}

                    {matchedProfile.educationLevel && (
                        <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400 shrink-0">
                <GraduationCap className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300"/>
                Education
              </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right line-clamp-1">
                {matchedProfile.educationLevel}
              </span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Bottom Quick Action Icons Bar */}
            <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/40 px-4">
                <Button
                    size="lg"
                    variant="default"
                    disabled={isSending || invitationSent}
                    onClick={handleSendInterest}
                >
                    {isSending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Sending...
                        </>
                    ) : invitationSent ? (
                        <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Interest Sent
                        </>
                    ) : (
                        "Send Interest"
                    )}
                </Button>

                <Button
                    variant="link"
                    size="lg"
                >
                    <Link href={`/my-dashboard/best-proposals/${id}`} className="flex items-center gap-1">View
                        Profile <ChevronRight/></Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default MatchingProfileCard;