import {db} from "@/lib/db";
import {desc, eq} from "drizzle-orm";
import {profileMatches} from "@/drizzle/schema";
import {calculateUserMatchesAction} from "@/app/actions/matchmaking-action";
import MatchingProfileCard from "@/components/landing/matching-profile-card";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {Button} from "@/components/ui/button";
import {Pen, Search} from "lucide-react";
import TitleHeader from "@/components/dashboard/title-header";
import Link from "next/link";

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


    let userMatches = await db.query.profileMatches.findMany({
        where: eq(profileMatches.userId, currentUserId),
        with: {
            matchedProfile: true,
        },
        orderBy: [desc(profileMatches.score)],
    });

    if (userMatches.length === 0) {
        await calculateUserMatchesAction(currentUserId);

        userMatches = await db.query.profileMatches.findMany({
            where: eq(profileMatches.userId, currentUserId),
            with: {
                matchedProfile: true,
            },
            orderBy: [desc(profileMatches.score)],
        });
    }

    const matchingProfiles = userMatches;

    console.log("MATCHING PROFILES FROM DB:", matchingProfiles);

    // if (matchingProfiles.length === 0) {
    //     return (
    //         <div className="bg-white p-12 rounded-lg border border-[#E8E2D7] space-y-3 text-center shadow-2xs">
    //             <div
    //                 className="w-12 h-12 rounded-full bg-[#F6EFE2] text-[#8E6516] flex items-center justify-center mx-auto mb-3">
    //                 <Search className="w-6 h-6"/>
    //             </div>
    //             <h3 className="font-editorial text-xl font-semibold text-accent-foreground">
    //                 No Matching Proposals Found
    //             </h3>
    //             <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
    //                 We couldn&apos;t find any candidate advertisements matching your selected combination of religion,
    //                 location, or search filters.
    //             </p>
    //             <Button>
    //                 Reset All Filters
    //             </Button>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
                <TitleHeader title={"Best Matrimonial Proposals"}
                             description={"Verified candidate advertisements aligned with your preferences. Confidentiality strictly respected."}/>
            </div>
            <section className="flex flex-col gap-8">
                <div className="flex-3 flex flex-col items-left justify-center gap-6">

                    {matchingProfiles && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {matchingProfiles.map((match) => (
                                 null    // <MatchingProfileCard key={match.id} match={match}/>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BestProposalsPage;
