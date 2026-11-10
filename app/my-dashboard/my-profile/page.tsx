import {getCurrentUserProfile} from "@/app/actions/profile-actions";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import DashboardStatsGrid from "@/components/dashboard/dashboard-stats-grid";
import {AlertCircle, Pen} from "lucide-react";
import MyProfileCard from "@/components/dashboard/my-profile-card";
import TitleHeader from "@/components/dashboard/title-header";
import {Separator} from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
    const result = await getCurrentUserProfile();
    const profile = result.data;
    // console.log("ALL_PROFILES_RELATED_TO_CURRENT_USER:", profile);

    if (!profile) {
        return (
            <div className="bg-white p-8 rounded-lg border border-[#FCA5A5] text-center shadow-2xs">
                <div
                    className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6"/>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-[#1F1B18]">
                    Unable to Load Candidate Registry
                </h3>
                <p className="text-xs text-[#554D45] max-w-md mx-auto mt-1">
                    A temporary connection issue prevented loading the matchmaking directory. Please check your network
                    connection and retry.
                </p>
                <Button>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
                <TitleHeader title={"My Matrimonial Profile & Advertisement"}
                             description={"Manage your verified advertisement, confidentiality settings, and review requests."}/>
                <Button size={"lg"}><Pen/>Edit Profile</Button>
            </div>

            <Separator/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <MyProfileCard id={profile.id} profileId={profile.profileID} status={profile.status}
                               gender={profile.gender}/>
            </div>
        </div>



    )
};

export default ProfilePage;
