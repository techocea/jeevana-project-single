import {db} from "@/lib/db";
import {desc, eq} from "drizzle-orm";
import {profileMatches} from "@/drizzle/schema";
import {calculateUserMatchesAction} from "@/app/actions/matchmaking-action";
import MatchingProfileCard from "@/components/landing/matching-profile-card";
import {getCurrentUser} from "@/app/actions/profile-actions";

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

    const profiles = userMatches;

    // console.log("MATCHING PROFILES FROM DB:", profiles);

    if (profiles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-medium">
                <p>No matching proposals found at this time.</p>
            </div>
        );
    }


    return (
        <main className="w-full">
            <section className="flex flex-col gap-8">
                <div className="flex-3 flex flex-col items-left justify-center gap-6">
                    <div className="flex flex-col gap-1.5 text-left">
                        <h1 className="text-2xl font-bold text-black">Best Matches For You {profiles.length}</h1>
                        <p className="text-sm text-muted-foreground">
                            Curated based on your partner preferences
                        </p>
                    </div>

                    {profiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-2">
                            {profiles.map((match) => (
                                <MatchingProfileCard key={match.id} match={match}/>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center min-h-[300px] rounded-lg border border-dashed text-center p-8">
                            <p className="text-muted-foreground font-medium">No matching profiles found yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Try expanding your partner preferences to discover more candidates.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BestProposalsPage;
