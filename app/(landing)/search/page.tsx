import { getProfilesByFilters } from "@/app/actions/profile-actions";
import FilterOptions from "@/components/landing/filter-options";
import { ProfileCard } from "@/components/landing/profile-card";
import { SearchFilters } from "@/types";

type SearchPageProps = {
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

const SearchProfiles = async ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = await searchParams;
  const filters = normalizeSearchFilters(resolvedSearchParams);
  const result = await getProfilesByFilters(filters);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
        {result.error ||
          "An error occurred while rendering your search result matches."}
      </div>
    );
  }

  const profiles = result.data;
  // console.log(profiles);

  return (
    <main className="w-full md:max-w-5xl mx-auto bg-white mt-16 md:my-28 md:pt-10 py-10 px-4 md:pr-10 md:pl-0">
      <section className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="flex-1">
          <FilterOptions />
        </div>
        <div className="flex-3 flex flex-col items-center gap-6">
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <ProfileCard key={profile.userId} {...profile} />
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No profiles found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default SearchProfiles;
