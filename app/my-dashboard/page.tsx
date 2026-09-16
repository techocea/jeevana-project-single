import { users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?mode=login");
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser || dbUser.onboardingStatus === "INCOMPLETED") {
    redirect("/onboarding");
  }

  return <div><h2 className="text-black">DashboardPage</h2></div>;
};

export default DashboardPage;
