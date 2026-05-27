import { db } from "@/lib/db";
import { users, profiles } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OnboardingPageClient from "./page.client";

const STEP_STRING_TO_NUMBER: Record<string, number> = {
  START: 1,
  RELIGION: 2,
  ACHIEVEMENTS: 3,
  LOCATION: 4,
  PERSONAL: 5,
  HOBBIES: 6,
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

  const savedStepString = userRecord?.onboardingStep || "START";

  if (savedStepString === "COMPLETED") {
    redirect(`/pricing?profileId=${profileRecord?.id}`);
  }

  const activeStepInt = STEP_STRING_TO_NUMBER[savedStepString] || 1;

  return (
    <OnboardingPageClient
      initialDbData={profileRecord || {}}
      savedStep={activeStepInt}
    />
  );
};

export default OnboardingPage;
