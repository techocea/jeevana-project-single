import SalesBarChart from "@/components/dashboard/sales-bar-chart";
import {SectionCards} from "@/components/dashboard/section-cards";
import TitleHeader from "@/components/dashboard/title-header";
import {
    getAgeDemographics,
    getProvinceDemographics,
    getSettledRevenueMonthly,
    getSalesAdsMonthly
} from "@/app/actions/dashboard-actions";
import AgeDemographicsChart from "@/components/dashboard/age-demographics-chart";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {Separator} from "@/components/ui/separator";
import ProvinceDemographicsChart from "@/components/dashboard/province-demographics-chart";
import {demoSalesData} from "@/lib/constants";

export const revalidate = 0

export default async function ControlPanelDashboard() {

    const {data: currentUser} = await getCurrentUser();

    const role: "admin" | "staff" | "user" | undefined = currentUser?.role;

    const userName = currentUser?.fullName;

    const [ageDemographics, provinceDemographics] = await Promise.all([
        getAgeDemographics(),
        getProvinceDemographics(),
    ])

    console.log("OVERALL DEMOGRAPHICS:", ageDemographics, provinceDemographics);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex items-end justify-between w-full">
                        <TitleHeader
                            title="Executive Business Hub & Analytics"
                            description="Reporting Period: May 1, 2026 – Oct 29, 2026 · Last Synced: Today, 01:50 AM (Asia/Colombo)"
                        />
                        {/* Timeframe Filter Buttons */}
                        <div className="flex items-center gap-2">
                            {/*<div className="flex items-center bg-[#FAF8F5] border border-[#D6CDBC] rounded-md p-0.5 text-xs">*/}
                            {/*    <button*/}
                            {/*        // onClick={() => setTimeframe('30d')}*/}
                            {/*        // className={`px-3 py-1.5 rounded transition-colors ${*/}
                            {/*        //     timeframe === '30d'*/}
                            {/*        //         ? 'bg-[#8E6516] text-white font-semibold shadow-2xs'*/}
                            {/*        //         : 'text-[#665D52] hover:text-[#1F1B18]'*/}
                            {/*        // }`}*/}
                            {/*    >*/}
                            {/*        Current Month*/}
                            {/*    </button>*/}
                            {/*    <button*/}
                            {/*        // onClick={() => setTimeframe('6m')}*/}
                            {/*        // className={`px-3 py-1.5 rounded transition-colors ${*/}
                            {/*        //     timeframe === '6m'*/}
                            {/*        //         ? 'bg-[#8E6516] text-white font-semibold shadow-2xs'*/}
                            {/*        //         : 'text-[#665D52] hover:text-[#1F1B18]'*/}
                            {/*        // }`}*/}
                            {/*    >*/}
                            {/*        Last 6 Months (YTD)*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    <Separator/>
                    <SectionCards role={role ?? "admin"}/>
                    <SalesBarChart data={demoSalesData}
                                   isConnected={true}
                                   periodLabel="Demo data · Jun–Nov 2026"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AgeDemographicsChart data={ageDemographics}/>
                        <ProvinceDemographicsChart data={provinceDemographics}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
