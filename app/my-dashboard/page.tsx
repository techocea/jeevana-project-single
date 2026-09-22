import {redirect} from "next/navigation";
import DashboardStatsGrid from "@/components/dashboard/dashboard-stats-grid";
import {
    getCurrentUser,
    getMatchingProfilesCount,
    getProfileViewCount,
} from "@/app/actions/profile-actions";

export const dynamic = 'force-dynamic';

const DashboardPage = async () => {
    const {data: currentUser} = await getCurrentUser();

    if (!currentUser) {
        redirect("/auth?mode=login");
    }

    if (currentUser.onboardingStatus === "INCOMPLETED") {
        redirect("/onboarding");
    }

    const [profileViewRes, totalMatchesCount] = await Promise.all([
        getProfileViewCount(currentUser.id),
        getMatchingProfilesCount(currentUser.id)
    ])

    const statsData = {
        totalViews: profileViewRes.data?.totalViews ?? 0,
        totalMatches: totalMatchesCount,
        totalPayment: 0, // PayHere integration placeholder
    };

    const userName = currentUser.fullName;

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-col gap-2">
                <h3 className="text-black font-sans">Welcome back, {userName} 👋 </h3>
                <p className="text-muted-foreground text-lg">Here's what's happening with your account today</p>
            </div>

            <DashboardStatsGrid statsData={statsData} />
        </div>
    )
};

export default DashboardPage;
