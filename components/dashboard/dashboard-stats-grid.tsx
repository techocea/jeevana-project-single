import {Card, CardContent} from "@/components/ui/card";
import {CircleDollarSign, Users, UserCheck, HandCoins} from "lucide-react";
import {getProfileViewCount} from "@/app/actions/profile-actions";

interface DashboardStatsProps {
    totalSpend?: string;
    totalMatches?: number;
    viewedProfiles?: number;
    acceptedInvites?: number;
}

interface DashboardStatsGridProps{
    statsData: DashboardStatsProps;
}

export default async function DashboardStatsGrid({
                                                     statsData
                                                 }: DashboardStatsGridProps) {

    const {
        totalSpend = "LKR 0.00",
        totalMatches = 0,
        viewedProfiles = 0,
    } = statsData;

    const stats = [
        {
            title: "Total Spend",
            value: totalSpend,
            subtitle: "From successful payments",
            icon: CircleDollarSign,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
        },
        {
            title: "Total Matches",
            value: totalMatches.toLocaleString(),
            subtitle: "Matches for today",
            icon: Users,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
        },
        {
            title: "Profile Views",
            value: viewedProfiles.toLocaleString(),
            subtitle: "Profiles who viewed me",
            icon: UserCheck,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <Card
                        key={index}
                        className="shadow-sm bg-card text-muted-foreground p-2"
                    >
                        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
                            <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                    <h4 className="font-sans text-2xl font-medium text-muted-foreground">
                                        {stat.title}
                                    </h4>
                                    <h3 className="font-sans font-semibold text-black">
                                        {stat.value}
                                    </h3>
                                </div>

                                <div
                                    className={`flex items-center justify-center h-10 w-10 rounded-xl shrink-0 ${stat.color}`}>
                                    <Icon className="h-5 w-5"/>
                                </div>
                            </div>

                            <p className="text-xs font-normal text-muted-foreground mt-4">
                                {stat.subtitle}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}