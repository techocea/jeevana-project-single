import { db } from "@/lib/db";
import { users, profiles } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OnboardingPageClient from "./page.client";

const STEP_STRING_TO_NUMBER: Record<string, number> = {
  START: 1, // Hasn't filled anything yet
  RELIGION: 2, // Finished Step 1, needs to do Religion
  ACHIEVEMENTS: 3, // Finished Step 2, needs to do Achievements
  LOCATION: 4, // Finished Step 3, needs to do Location
  PERSONAL: 5, // Finished Step 4, needs to do Personal
  HOBBIES: 6, // Finished Step 5, needs to do Hobbies
  PREFERENCES: 7,
};

const OnboardingPage = async () => {
  const supabase = await createClient();
  const {
    data: { user: authedUser },
  } = await supabase.auth.getUser();

  if (!authedUser) {
    redirect("/auth?mode=login");
  }

  const [userRecord, profileRecord] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, authedUser.id) }),
    db.query.profiles.findFirst({ where: eq(profiles.userId, authedUser.id) }),
  ]);

  if (!userRecord) {
    return <OnboardingPageClient initialDbData={null} savedStep={1} />;
  }
  const savedStepString = userRecord?.onboardingStep || "START";

  if (savedStepString === "COMPLETED") {
    redirect(`/my-dashboard/my-profile`);
    // redirect(`/pricing?profileId=${profileRecord?.id}`);
  }

  const activeStepInt = STEP_STRING_TO_NUMBER[savedStepString] || 1;

  return (
    <OnboardingPageClient
      initialDbData={profileRecord || null}
      savedStep={activeStepInt}
    />
  );
};

export default OnboardingPage;
