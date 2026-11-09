"use client"

import {
    Card,
    CardHeader,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {CircleDollarSign, Users, UserCheck, Sparkles, ChevronRight} from "lucide-react";
import {getProfileViewCount} from "@/app/actions/profile-actions";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface DashboardStatsProps {
    totalSpend?: string;
    totalMatches?: number;
    viewedProfiles?: number;
    acceptedInvites?: number;
}

interface DashboardStatsGridProps {
    statsData: DashboardStatsProps;
}

export default function DashboardStatsGrid({
                                               statsData
                                           }: DashboardStatsGridProps) {

    const {
        totalSpend = "LKR 0.00",
        totalMatches = 0,
        viewedProfiles = 0,
    } = statsData;

    const router = useRouter();

    const stats = [
        {
            title: "Matches Today",
            value: totalSpend,
            subtitle: "New matching candidates today",
            icon: CircleDollarSign,
            label: "browse matches",
            href: "/best-proposals",
        },
        {
            title: "Received Invitations",
            value: totalMatches.toLocaleString(),
            subtitle: "Awaiting your response",
            icon: Users,
            label: "view invitations",
            href: "/recieved-invitations",
        },
        {
            title: "Profile & Account",
            value: viewedProfiles.toLocaleString(),
            subtitle: "Advertisement:",
            icon: UserCheck,
            label: "manage profile",
            href: "/my-profile",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <Card
                        key={index}
                        className="flex flex-col pb-2 justify-between hover:border-strong transition-colors">

                        <CardHeader>
                            <div className="flex items-center justify-between">
              <span className="text-xs pb-1 font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </span>
                                <Icon className="w-4 h-4 text-primary"/>
                            </div>

                            <CardDescription className="text-xs text-muted-foreground">
                                <span>
                                  New matching candidates today <br/>
                                  <span className="text-[11px] text-muted-foreground">
                                    ({} total qualified in directory)
                                  </span>
                                </span>
                            </CardDescription>
                        </CardHeader>

                        <CardFooter className="border-t border-strong flex items-center justify-between">
                            <Button
                                variant={"link"}
                                type={"button"}
                                onClick={() => router.push(`/my-dashboard/${stat.href}`)}
                                className="text-xs p-0 uppercase"
                            >
                                {stat.label}
                                <ChevronRight className="w-3.5 h-3.5"/>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}