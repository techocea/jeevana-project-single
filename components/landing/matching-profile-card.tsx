"use client";

import {useState} from "react";
import {
    Check,
    Loader2,
    MapPin,
    Send,
    User,
} from "lucide-react";
import toast from "react-hot-toast";

import {sendInvitation} from "@/app/actions/invitation-actions";
import {convertCmToFeetInches} from "@/helpers/measurement-utils";
import {getAccurateAge} from "@/helpers/format-date";
import Link from "next/link";

export interface PartnerPreference {
    preferredProfession: string[] | null;
    preferredMinAge: number | null;
    preferredMaxAge: number | null;
}

export interface MatchingProfileData {
    id: string;
    fullName: string | null;
    profession: string | null;
    religion: string | null;
    dob: Date | string | null;
    educationLevel: string | null;
    city: string | null;
    country: string | null;
    profilePic: string | null;
    photoVisible: boolean;
    narrative?: string | null;
    createdAt: Date | string | null;
    height: string | null;
}

interface MatchingProfileCardProps {
    match: MatchingProfileData
    partnerPreference?: PartnerPreference | null;
}

function toDateOnly(
    value: Date | string | null | undefined,
): string | null {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return date.toISOString().split("T")[0];
}

function formatPreferredAge(
    minAge: number | null | undefined,
    maxAge: number | null | undefined,
): string | null {
    if (minAge != null && maxAge != null) {
        return `${minAge}–${maxAge} years`;
    }

    if (minAge != null) {
        return `${minAge}+ years`;
    }

    if (maxAge != null) {
        return `Up to ${maxAge} years`;
    }

    return null;
}

const MatchingProfileCard = ({
                                     match,  partnerPreference,
                             }: MatchingProfileCardProps) => {
    const [isSending, setIsSending] = useState(false);
    const [invitationSent, setInvitationSent] = useState(
        false
    );

    const displayName = match.fullName?.trim() || "Member";
    const submittedAt = toDateOnly(match.createdAt);
    const parsedDOB = toDateOnly(match.dob);

    const calculatedAge = parsedDOB
        ? getAccurateAge(parsedDOB)
        : null;

    const age =
        typeof calculatedAge === "number" &&
        Number.isFinite(calculatedAge) &&
        calculatedAge >= 0
            ? calculatedAge
            : null;

    const heightCm = Number(match.height);

    const heightStr =
        match.height?.trim() &&
        Number.isFinite(heightCm) &&
        heightCm > 0
            ? convertCmToFeetInches(match.height).formatted
            : null;

    const preferredProfessions =
        partnerPreference?.preferredProfession?.filter(
            (profession) => profession.trim().length > 0,
        ) ?? [];

    const preferredAge = formatPreferredAge(
        partnerPreference?.preferredMinAge,
        partnerPreference?.preferredMaxAge,
    );

    const location = [match.city?.trim(), match.country?.trim()]
        .filter(Boolean)
        .join(", ");

    const summaryDetails = [
        age != null ? `${age} yrs` : null,
        heightStr,
        match.religion?.trim(),
    ].filter(Boolean);

    const narrative = match.narrative?.trim();
    const canShowPhoto = match.photoVisible && !!match.profilePic;

    const handleSendInterest = async () => {
        if (isSending || invitationSent) return;

        setIsSending(true);

        try {
            const result = await sendInvitation(match.id);

            if (!result.success) {
                if (
                    result.error
                        ?.toLowerCase()
                        .includes("already sent")
                ) {
                    setInvitationSent(true);

                    toast(
                        "You've already sent an interest to this profile.",
                    );
                    return;
                }

                toast.error(
                    result.error ||
                    "Couldn't send interest. Please try again.",
                );
                return;
            }

            setInvitationSent(true);
            toast.success(`Interest sent to ${displayName}.`);
        } catch (error: unknown) {
            console.error("[SEND_INTEREST_ERROR]:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <article
            className="flex h-full min-w-0 flex-col justify-between rounded-xl border border-[#E8E2D7] bg-white p-4 shadow-sm transition-[border-color,box-shadow] hover:border-[#D6CDBC] hover:shadow-md sm:p-5">
            <div>
                {/* Profile reference and registration date */}
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#F2ECE3] pb-3">
                    <span
                        title={match.id}
                        className="min-w-0 max-w-[60%] truncate rounded-md bg-[#F2ECE3] px-2 py-1 font-mono text-[10px] font-medium text-[#554D45]"
                    >
                        {match.profileID}
                    </span>

                    {submittedAt && (
                        <time
                            dateTime={submittedAt}
                            title="Profile created"
                            className="shrink-0 text-[10px] tabular-nums text-[#8C8375]"
                        >
                            {submittedAt}
                        </time>
                    )}
                </div>

                {/* Photo and profile details */}
                <div className="mb-4 flex items-start gap-3 sm:gap-4">
                    <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E8E2D7] bg-[#FAF8F5] sm:h-24 sm:w-24">
                        {canShowPhoto ? (
                            <img
                                src={match.profilePic!}
                                alt={`${displayName}'s profile`}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="px-2 text-center text-[#8C8375]">
                                <User
                                    aria-hidden="true"
                                    className="mx-auto mb-1.5 h-7 w-7 text-[#8E6516]"
                                />
                                <span className="block text-[9px] leading-tight">
                                    {match.photoVisible
                                        ? "No photo"
                                        : "Photo private"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3
                            title={displayName}
                            className="truncate font-editorial text-xl font-semibold leading-tight text-[#1F1B18]"
                        >
                            {displayName}
                        </h3>

                        {summaryDetails.length > 0 && (
                            <p className="mt-1 text-[11px] leading-relaxed text-[#665D52]">
                                {summaryDetails.join(" · ")}
                            </p>
                        )}

                        <p className="mt-2 truncate text-xs font-medium text-[#1F1B18]">
                            {match.profession?.trim() ||
                                "Profession not specified"}
                        </p>

                        {match.educationLevel?.trim() && (
                            <p className="mt-1 truncate text-[11px] text-[#7A7065]">
                                {match.educationLevel}
                            </p>
                        )}

                        {location && (
                            <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[11px] text-[#8C8375]">
                                <MapPin
                                    aria-hidden="true"
                                    className="h-3 w-3 shrink-0 text-[#8E6516]"
                                />
                                <span
                                    title={location}
                                    className="truncate"
                                >
                                    {location}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile narrative */}
                {narrative && (
                    <div className="mb-4 rounded-lg border border-[#F2ECE3] bg-[#FAF8F5] px-3 py-2.5">
                        <p className="line-clamp-2 text-xs leading-relaxed text-[#4A423A]">
                            {narrative}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8C8375]">
                        Looking for
                    </p>

                    {preferredProfessions.length > 0 || preferredAge ? (
                        <div className="flex flex-wrap gap-1.5">
                            {preferredProfessions.map((profession) => (
                                <span
                                    key={profession}
                                    className="max-w-full break-words rounded-md border border-[#E8E2D7] bg-[#FAF8F5] px-2 py-1 text-[11px] text-[#554D45]"
                                >
                    {profession}
                </span>
                            ))}

                            {preferredAge && (
                                <span className="rounded-md border border-[#E8E2D7] bg-[#FAF8F5] px-2 py-1 text-[11px] text-[#554D45]">
                    {preferredAge}
                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-[11px] text-[#8C8375]">
                            Preferences not specified
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2 border-t border-[#F2ECE3] pt-3 sm:grid-cols-2">
                <Link
                    href={`/my-dashboard/best-proposals/${match.id}`}
                    aria-label={`View ${displayName}'s full profile`}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#D6CDBC] px-3 py-2 text-xs font-medium text-[#4A423A] transition-colors hover:bg-[#F2ECE3] hover:text-[#1F1B18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E6516] focus-visible:ring-offset-2"
                >
                    View Full Profile
                </Link>

                <button
                    type="button"
                    onClick={handleSendInterest}
                    disabled={isSending || invitationSent}
                    aria-busy={isSending}
                    className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E6516] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                        invitationSent
                            ? "border border-[#D6CDBC] bg-[#F2ECE3] text-[#7A7065]"
                            : "bg-[#8E6516] text-white hover:bg-[#775310] disabled:opacity-60"
                    }`}
                >
                    {isSending ? (
                        <Loader2
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 animate-spin"
                        />
                    ) : invitationSent ? (
                        <Check
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0"
                        />
                    ) : (
                        <Send
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0"
                        />
                    )}

                    <span>
                        {isSending
                            ? "Sending..."
                            : invitationSent
                                ? "Invitation Sent"
                                : "Send Invitation"}
                    </span>
                </button>
            </div>
        </article>
    );
};

export default MatchingProfileCard;