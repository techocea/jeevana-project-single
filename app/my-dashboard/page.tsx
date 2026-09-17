import {users} from "@/drizzle/schema";
import {db} from "@/lib/db";
import {createClient} from "@/utils/supabase";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import DashboardStatsGrid from "@/components/dashboard/dashboard-stats-grid";

const DashboardPage = async () => {
    const supabase = await createClient();

    const {
        data: {user: authedUser},
    } = await supabase.auth.getUser();

    if (!authedUser) {
        redirect("/auth?mode=login");
    }

    const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, authedUser.id))
        .limit(1);

    if (!dbUser || dbUser.onboardingStatus === "INCOMPLETED") {
        redirect("/onboarding");
    }
    // console.log("Authed User:", authedUser);
    const userName = authedUser.user_metadata.full_name;

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-col gap-2">
                <h3 className="text-black font-sans">Welcome back, {userName} 👋 </h3>
                <p className="text-muted-foreground text-lg">Here's what's happening with your account today</p>
            </div>

            <DashboardStatsGrid  />
        </div>
    )
};

export default DashboardPage;
