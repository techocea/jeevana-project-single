import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Users, UserCheck, HandCoins } from "lucide-react";

interface DashboardStatsProps {
    totalSpend?: string;
    totalProfiles?: number;
    activeProfiles?: number;
    pendingPayments?: number;
}

export default function DashboardStatsGrid({
                                               totalSpend = "Rs. 0.00",
                                               totalProfiles = 1,
                                               activeProfiles = 0,
                                               pendingPayments = 0,
                                           }: DashboardStatsProps) {
    const stats = [
        {
            title: "Total Spend",
            value: totalSpend,
            subtitle: "From successful payments",
            icon: CircleDollarSign,
        },
        {
            title: "Total Profiles",
            value: totalProfiles,
            subtitle: "Registered profiles",
            icon: Users,
        },
        {
            title: "Active Profiles",
            value: activeProfiles,
            subtitle: "Visible to members",
            icon: UserCheck,
        },
        {
            title: "Pending Payments",
            value: pendingPayments,
            subtitle: "Awaiting confirmation",
            icon: HandCoins,
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

                                <div className="flex items-center justify-center h-11 w-11 rounded-full bg-muted/20 text-[var(--secondary)] shrink-0">
                                    <Icon className="h-5 w-5" />
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