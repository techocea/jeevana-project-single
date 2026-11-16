"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    TrendingUp,
    Receipt,
    Clock,
    Users,
    ArrowRight
} from "lucide-react";
import {AppRole} from "@/types";
import Link from "next/link";

export function SectionCards({role}: { role: AppRole }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {role === "admin" ? (
                <>
                    {/* Metric 1: Revenue for Selected Period */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C8375] uppercase tracking-wider">
                Settled Period Revenue
              </span>
                                <TrendingUp className="w-4 h-4 text-[#8E6516]"/>
                            </div>
                            <CardTitle className="text-xl font-semibold text-[#1F1B18] mt-1 font-mono">
                                {/*Rs. {displayRevenue.toLocaleString()}*/}
                                Rs. 2,943,600
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-[11px] text-[#665D52] leading-tight">
                                Current Month (November 2026)
                            </div>
                        </CardContent>
                    </Card>
                    {/* Metric 2: Successful Paid Memberships/Sales */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C8375] uppercase tracking-wider">
                Successful Paid Sales
              </span>
                                <Receipt className="w-4 h-4 text-[#2563EB]"/>
                            </div>
                            <CardTitle className="text-xl font-semibold text-[#1F1B18] mt-1 tabular-numbers font-mono">
                                32 {/*{displaySales}*/}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-[11px] text-[#2563EB] font-medium leading-tight">
                                {/*{timeframe === '30d' ? 'Completed checkouts this month' : 'Total sales across period'}*/}
                                Completed checkouts this month
                            </div>
                            <div className="text-[10px] text-[#8C8375] mt-1">
                                Distinct checkout transactions
                            </div>
                        </CardContent>
                    </Card>
                    {/* Metric 3: Active Memberships */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C8375] uppercase tracking-wider">
                Active Memberships
              </span>
                                <Users className="w-4 h-4 text-[#15803D]"/>
                            </div>
                            <CardTitle className="text-xl font-semibold text-[#1F1B18] mt-1 tabular-numbers font-mono">
                                {/*{data.paidActiveMemberships}*/}
                                150
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-[11px] text-[#15803D] font-medium leading-tight">
                                Currently unexpired subscriptions
                            </div>
                            <div className="text-[10px] text-[#8C8375] mt-1">
                                112 Gold · 28 Platinum · 10 Concierge
                            </div>
                        </CardContent>
                    </Card>
                    {/* Metric 4: Pending Advertisement Reviews */}
                    <Link href={"/control-panel/reviews"}>
                        <Card
                            className="hover:border-[#8E6516] cursor-pointer transition-colors h-full"
                        >

                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C8375] uppercase tracking-wider">
                Pending Ad Reviews
              </span>
                                    <Clock className="w-4 h-4 text-[#B45309]"/>
                                </div>
                                <CardTitle className="text-xl font-semibold text-[#1F1B18] mt-1 tabular-numbers font-mono">
                                    {/*{userProfile.profileReviewStatus === 'pending' ? '1' : '0'}*/} 0
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-[11px] text-[#B45309] font-medium leading-tight">
                                    Awaiting editorial sign-off
                                </div>
                                <div className="text-[10px] text-[#8E6516] flex items-center gap-1 mt-1 font-semibold">
                                    <span>Open Review Queue</span>
                                    <ArrowRight className="w-3 h-3"/>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </>
            ) : null}
        </div>
    );
}
