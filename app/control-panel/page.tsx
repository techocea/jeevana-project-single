import {RevenueAdChart} from "@/components/dashboard/revenue-ad-chart";
import {SectionCards} from "@/components/dashboard/section-cards";
import TitleHeader from "@/components/dashboard/title-header";
import {createClient} from "@/utils/supabase";
import {redirect} from "next/navigation";
import {getDemographicsData, getRevenueAdData} from "@/app/actions/dashboard-actions";
import {DemographicsChart} from "@/components/dashboard/demographics-chart";

export const revalidate = 0

export default async function ControlPanelDashboard() {
    const supabase = await createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
        redirect("/admin");
    }

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
                        description="Your ecosystem is thriving. Total ad impressions are up by 12% this week."
                    />
                    <SectionCards/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
