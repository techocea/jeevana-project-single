import {
    getCurrentUser,
    getMatchingProfilesCount,
    getProfileViewCount,
} from "@/app/actions/profile-actions";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import TitleHeader from "@/components/dashboard/title-header";
import DashboardStatsGrid from "@/components/dashboard/dashboard-stats-grid";
import {Search} from "lucide-react";
import Link from "next/link";
import {RecommendedCandidates} from "@/components/dashboard/recommended-candidates";
import {sampleProposals} from "@/lib/constants";

export const dynamic = 'force-dynamic';

const DashboardPage = async () => {
    const {data: currentUser} = await getCurrentUser();

    if (!currentUser) {
        redirect("/")
    }

    // console.log("Current user stats:", currentUser);

    const [profileViewRes, totalMatchesCount] = await Promise.all([
        getProfileViewCount(currentUser.id),
        getMatchingProfilesCount(currentUser.id)
    ])

    const statsData = {
        totalViews: profileViewRes.data?.totalViews ?? 0,
        totalMatches: totalMatchesCount,
    };

    const userName = currentUser.fullName;

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between w-full">
                <TitleHeader title={`Ayubowan, ${userName}`}
                             description={"Overview of your daily match discoveries, incoming invitations, and profile status."}/>

                <Button
                    type="button"
                    asChild
                >
                    <Link href={"/best-proposals"} className={"flex items-center gap-2"}>
                        <Search className="w-3.5 h-3.5"/>
                        <span>Browse Matching Proposals</span>
                    </Link>
                </Button>
            </div>

            <DashboardStatsGrid statsData={statsData}/>
            <RecommendedCandidates proposals={sampleProposals}/>
            {/*<RecentRecievedInvitations/>*/}
        </div>
    )
};

export default DashboardPage;
