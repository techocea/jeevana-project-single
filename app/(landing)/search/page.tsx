import { getProfilesByFilters } from "@/app/actions/profile-actions";
import FilterOptions from "@/components/landing/filter-options";
import { ProfileCard } from "@/components/landing/profile-card";
import { db } from "@/lib/db";
import { profiles as profilesSchema } from "@/drizzle/schema";
import { SearchFilters } from "@/types";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const getSearchValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0] || undefined;
  }
  return value || undefined;
};

const normalizeSearchFilters = (
  searchParams: Record<string, string | string[] | undefined>,
): SearchFilters => ({
  lookingFor: getSearchValue(searchParams.lookingFor),
  minAge: getSearchValue(searchParams.minAge),
  maxAge: getSearchValue(searchParams.maxAge),
  religion: getSearchValue(searchParams.religion),
  caste: getSearchValue(searchParams.caste),
  motherTongue: getSearchValue(searchParams.motherTongue),
  educationLevel: getSearchValue(searchParams.educationLevel),
  profession: getSearchValue(searchParams.profession),
  annualIncomeRange: getSearchValue(searchParams.annualIncomeRange),
  country: getSearchValue(searchParams.country),
  state: getSearchValue(searchParams.state),
  hobbies: getSearchValue(searchParams.hobbies),
});

const SearchProfiles = async ({ searchParams }: PageProps) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
        <p>User not authenticated</p>
      </div>
    );
  }

  const currentProfile = await db.query.profiles.findFirst({
    where: eq(profilesSchema.userId, user.id),
    columns: { id: true },
  });

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-100 text-amber-600 font-medium">
        <p>
          Please complete your profile setup before searching for proposals.
        </p>
      </div>
    );
  }

  const resolvedSearchParams = await searchParams;
  const filters = normalizeSearchFilters(resolvedSearchParams);

  const result = await getProfilesByFilters(filters, currentProfile?.id);
  const profiles = result.data || [];

  // console.log("Current profile id:", currentProfile?.id);
  // console.log("Returned profiles from DB:", result.data);
  // console.log(profiles);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
        {result.error ||
          "An error occurred while rendering your search result matches."}
      </div>
    );
  }

  return (
    <main className="w-full md:max-w-5xl mx-auto bg-white mt-16 md:my-28 md:pt-10 py-10 px-4 md:pr-10 md:pl-0">
      <section className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="flex-1">
          <FilterOptions />
        </div>
        <div className="flex-3 flex flex-col items-center gap-6">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                currentProfileId={currentProfile?.id || ""}
                profileCardData={profile}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No profiles found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default SearchProfiles;
