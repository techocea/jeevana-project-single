import {getProfilesByFilters} from "@/app/actions/profile-actions";
import FilterOptions from "@/components/landing/filter-options";
import {ProfileCard} from "@/components/landing/profile-card";
import {SearchFilters} from "@/types";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {AlertCircle, ArrowLeft} from "lucide-react";
import {getCommunityTitles} from "@/helpers/get-community-titles";

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
    community: getSearchValue(searchParams.community),
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

const SearchProfiles = async ({searchParams}: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const filters = normalizeSearchFilters(resolvedSearchParams);

    const result = await getProfilesByFilters(filters);
    const profiles = result.data || [];

    // console.log("Current profile id:", currentProfile?.id);
    // console.log("Returned profiles from DB:", result.data);

    if (!result.success) {
        return (
            <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
                {result.error ||
                    "An error occurred while rendering your search result matches."}
            </div>
        );
    }

    const communityTitleElement = getCommunityTitles(filters.community || "");

    return (
        <main className="w-full">
            <section
                className="relative min-h-[65dvh] md:min-h-[475px] w-full flex flex-col items-center justify-center">
                <Image
                    src="/images/hero-bg.png"
                    alt="Elegant Sri Lankan bride dressed in traditional white Kandyan sari"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Dark overlay mask */}
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10"/>

                {/* Hero Copywriting */}
                <div
                    className="absolute z-10 mt-10 w-full flex flex-col items-start gap-4 px-6">
                    <div className="space-y-1 text-white">
                        <Link href="/"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 mb-2">
                            <ArrowLeft className="w-4 h-4"/> Back to Home
                        </Link>
                        {communityTitleElement}
                    </div>

                    <div className="flex flex-row items-start w-full gap-3">
  <span
      className="w-full sm:w-auto flex px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white items-center justify-center text-xs font-semibold border border-white/20 white-space-nowrap">
    Showing 0 Profiles
  </span>
                        <div className="w-full sm:hidden">
                            <FilterOptions/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col md:flex-row md:items-start gap-8 p-10">
                <div className="flex-1 hidden sm:block">
                    <FilterOptions/>
                </div>
                <div className="flex-3 flex flex-col items-center gap-6">
                    {profiles.length > 0 ? (
                        profiles.map((profile) => (
                            <ProfileCard
                                key={profile.id}
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
    )
        ;
};
export default SearchProfiles;
