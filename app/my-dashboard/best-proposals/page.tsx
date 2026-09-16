import FilterOptions from "@/components/landing/filter-options";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase";
import {desc, eq} from "drizzle-orm";
import { ProfileCard } from "@/components/landing/profile-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {profileMatches} from "@/drizzle/schema";
import {calculateUserMatchesAction} from "@/app/actions/matchmaking-action";
import MatchingProfileCard from "@/components/landing/matching-profile-card";

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const BestProposalsPage = async ({ searchParams }: PageProps) => {
    const supabase = await createClient();

    const {
        data: { user:authedUser },
    } = await supabase.auth.getUser();

    if (!authedUser) {
        return (
            <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
                <p>User not authenticated</p>
            </div>
        );
    }

    const currentUserId = authedUser.id;

    const resolvedSearchParams = await searchParams;

    const currentPage = Number(resolvedSearchParams.page) || 1;
    const pageSize = 4;

    let userMatches = await db.query.profileMatches.findMany({
        where: eq(profileMatches.userId, currentUserId),
        with:{
            matchedProfile:true,
        },
        orderBy:[desc(profileMatches.score)],
    });

    if(userMatches.length === 0) {
        await calculateUserMatchesAction(currentUserId);

        userMatches = await db.query.profileMatches.findMany({
            where: eq(profileMatches.userId, currentUserId),
            with:{
                matchedProfile:true,
            },
            orderBy:[desc(profileMatches.score)],
        });
    }

    const totalPages = Math.ceil(userMatches.length / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const profiles = userMatches.slice(startIndex, startIndex + pageSize);

    // console.log("MATCHING PROFILES FROM DB:", profiles);

    if (profiles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-medium">
                <p>No matching proposals found at this time.</p>
            </div>
        );
    }

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(
            resolvedSearchParams as Record<string, string>,
        );
        params.set("page", pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <main className="w-full">
            <section className="flex flex-col gap-8">
                <div className="flex-3 flex flex-col items-left justify-center gap-6">
                    <div className="flex flex-col gap-1.5 text-left">
                        <h1 className="text-2xl font-bold text-black">Best Matches For You</h1>
                        <p className="text-sm text-muted-foreground">
                            Curated based on your partner preferences
                        </p>
                    </div>

                    {profiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-6">
                            {profiles.map((match) => (
                                <MatchingProfileCard key={match.id} match={match} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg border border-dashed text-center p-8">
                            <p className="text-muted-foreground font-medium">No matching profiles found yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Try expanding your partner preferences to discover more candidates.
                            </p>
                        </div>
                    )}

                    {profiles.length > pageSize && (
                        <div className="flex items-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                asChild
                                disabled={currentPage <= 1}
                            >
                                {currentPage > 1 ? (
                                    <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
                                ) : (
                                    <span>Previous</span>
                                )}
                            </Button>

                            <span className="text-sm font-medium text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                asChild
                                disabled={currentPage >= totalPages}
                            >
                                {currentPage < totalPages ? (
                                    <Link href={createPageUrl(currentPage + 1)}>Next</Link>
                                ) : (
                                    <span>Next</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BestProposalsPage;
