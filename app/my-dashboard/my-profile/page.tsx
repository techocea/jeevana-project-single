import {getCurrentUserProfile} from "@/app/actions/profile-actions";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import DashboardStatsGrid from "@/components/dashboard/dashboard-stats-grid";
import {Plus} from "lucide-react";
import MyProfileCard from "@/components/dashboard/my-profile-card";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
    const result = await getCurrentUserProfile();
    const profile = result.data;
    // console.log("ALL_PROFILES_RELATED_TO_CURRENT_USER:", profile);

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-20">
                <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">
                        Profile unavailable
                    </h2>
                    <p className="mt-4 text-muted">
                        We could not locate your profile. Please complete your onboarding or
                        try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <h3 className="text-black font-sans">My Profiles </h3>
                    <p className="text-muted-foreground text-lg">Manage your matrimonial profiles here</p>
                </div>
                <Button size={"lg"}><Plus/>Create Profile</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <MyProfileCard id={profile.id} profileId={profile.profileID} status={profile.status} gender={profile.gender} />
            </div>
        </div>
    )
};

export default ProfilePage;
