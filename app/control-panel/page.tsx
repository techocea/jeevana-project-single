import {RevenueAdChart} from "@/components/dashboard/revenue-ad-chart";
import {SectionCards} from "@/components/dashboard/section-cards";
import TitleHeader from "@/components/dashboard/title-header";
import {getDemographicsData, getRevenueAdData} from "@/app/actions/dashboard-actions";
import {DemographicsChart} from "@/components/dashboard/demographics-chart";
import {getCurrentUser} from "@/app/actions/profile-actions";

export const revalidate = 0

export default async function ControlPanelDashboard() {

    const {data: currentUser} = await getCurrentUser();

    const role: "admin" | "staff" | "user" | undefined = currentUser?.role;

    const userName = currentUser?.fullName;

    const [demographics] = await Promise.all([
        getDemographicsData(),
        // getRevenueAdData(30),
    ])

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6">
                    <TitleHeader
                        isGreeting={true}
                        userName={userName}
                        description="Your ecosystem is thriving. Total ad impressions are up by 12% this week."
                    />
                    <SectionCards role={role ?? "admin"}/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <RevenueAdChart data={[]}/>
                        </div>
                        <div className="lg:col-span-1">
                            <DemographicsChart data={demographics}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
