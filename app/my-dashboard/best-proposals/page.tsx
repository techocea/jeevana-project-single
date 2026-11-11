import {db} from "@/lib/db";
import {desc, and, eq} from "drizzle-orm";
import {partnerPreferences, profileMatches, profiles} from "@/drizzle/schema";
import {calculateUserMatchesAction} from "@/app/actions/matchmaking-action";
import MatchingProfileCard from "@/components/landing/matching-profile-card";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {Button} from "@/components/ui/button";
import {AlertCircle, Pen, Search} from "lucide-react";
import TitleHeader from "@/components/dashboard/title-header";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import FilterOptions from "@/components/landing/filter-options";

const BestProposalsPage = async () => {
    const {data: currentUser} = await getCurrentUser();

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
                <p>User not authenticated</p>
            </div>
        );
    }

    const currentUserId = currentUser.id;
    const loadUserMatches = () =>
        db
            .select({
                match: {
                    id: profileMatches.id,
                    userId: profileMatches.userId,
                    matchedProfileId: profileMatches.matchedProfileId,
                    score: profileMatches.score,
                    matchReasons: profileMatches.matchReasons,
                    viewedAt: profileMatches.viewedAt,
                    updatedAt: profileMatches.updatedAt,
                },
                matchedProfile: {
                    id: profiles.id,
                    profileID: profiles.profileID,
                    fullName: profiles.fullName,
                    profession: profiles.profession,
                    religion: profiles.religion,
                    dob: profiles.dob,
                    educationLevel: profiles.educationLevel,
                    city: profiles.city,
                    country: profiles.country,
                    profilePic: profiles.profilePic,
                    photoVisible: profiles.photoVisible,
                    narrative: profiles.narrative,
                    createdAt: profiles.createdAt,
                    height: profiles.height,
                },
                partnerPreference: {
                    preferredProfession:
                    partnerPreferences.preferredProfessions,
                    preferredMinAge:
                    partnerPreferences.preferredMinAge,
                    preferredMaxAge:
                    partnerPreferences.preferredMaxAge,
                },
            })
            .from(profileMatches)
            .innerJoin(
                profiles,
                eq(profileMatches.matchedProfileId, profiles.id),
            )
            .leftJoin(
                partnerPreferences,
                eq(
                    partnerPreferences.userId,
                    profileMatches.matchedProfileId,
                ),
            )
            .where(
                and(
                    eq(profileMatches.userId, currentUserId),
                    eq(profiles.status, "approved"),
                ),
            )
            .orderBy(desc(profileMatches.score));

    let userMatches = await loadUserMatches();

    if (userMatches.length === 0) {
        await calculateUserMatchesAction(currentUserId);

        userMatches = await loadUserMatches();
    }

    const matchingProfiles = userMatches;

    console.log("MATCHING PROFILES FROM DB:", matchingProfiles);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
                <TitleHeader title={"Best Matrimonial Proposals"}
                             description={"Verified candidate advertisements aligned with your preferences. Confidentiality strictly respected."}/>
            </div>

            <Separator/>
            <FilterOptions/>
            <section className="flex flex-col gap-8">
                <div className="flex-3 flex flex-col items-left justify-center gap-6">

                    {matchingProfiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {matchingProfiles.map((row) => (
                            <MatchingProfileCard
                                key={row.match.id}
                                match={row.matchedProfile}
                                partnerPreference={row.partnerPreference}
                            />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white space-y-2 p-8 rounded-lg border border-strong text-center shadow-2xs">
                            <div
                                className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6"/>
                            </div>
                            <h3 className="font-editorial text-lg font-semibold text-[#1F1B18]">
                                No Matching Proposals Found
                            </h3>
                            <p className="text-xs text-[#554D45] max-w-md mx-auto">
                                We couldn&apos;t find any candidate advertisements matching your selected combination of
                                religion,
                                location, or search filters.
                            </p>
                            <Button>
                                Reset All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BestProposalsPage;
