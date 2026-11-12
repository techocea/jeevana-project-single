import {
    CircleDollarSign,
    FileText,
    Users,
    Clock,
    TrendingUp,
} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DashboardStats} from "@/app/actions/dashboard-actions";

export function ControlPanelStats({stats}: {stats: DashboardStats}) {
    const formattedRevenue = `LKR ${stats.totalRevenue.toLocaleString()}`;

    const items = [
        {
            title: "Total Revenue",
            value: formattedRevenue,
            subtext: "+14.2% from last month",
            icon: CircleDollarSign,
            iconBg: "bg-emerald-50 text-emerald-600",
            badgeText: "+14.2%",
            badgeColor: "text-emerald-700 bg-emerald-50",
        },
        {
            title: "No. of Sales Ads",
            value: stats.salesAdsCount.toLocaleString(),
            subtext: "Total matrimonial proposals",
            icon: FileText,
            iconBg: "bg-indigo-50 text-indigo-600",
            badgeText: "+8.1%",
            badgeColor: "text-indigo-700 bg-indigo-50",
        },
        {
            title: "Active Members Count",
            value: stats.activeMembersCount.toLocaleString(),
            subtext: "Verified user accounts",
            icon: Users,
            iconBg: "bg-sky-50 text-sky-600",
            badgeText: "+12.5%",
            badgeColor: "text-sky-700 bg-sky-50",
        },
        {
            title: "Pending Ad Reviews",
            value: stats.pendingAdReviewsCount.toLocaleString(),
            subtext: "Awaiting staff validation",
            icon: Clock,
            iconBg: "bg-amber-50 text-amber-600",
            badgeText: stats.pendingAdReviewsCount > 0 ? "Requires Action" : "Up to date",
            badgeColor: stats.pendingAdReviewsCount > 0 ? "text-amber-700 bg-amber-50" : "text-neutral-600 bg-neutral-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <Card key={idx} className="bg-white shadow-xs border border-neutral-200/80 rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                {item.title}
                            </span>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight text-neutral-900">
                                {item.value}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${item.badgeColor}`}>
                                    <TrendingUp className="w-3 h-3" />
                                    {item.badgeText}
                                </span>
                                <span className="truncate">{item.subtext}</span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
