import { getProfilesByFilters } from "@/app/actions/profile-actions";
import FilterOptions from "@/components/landing/filter-options";
import { db } from "@/lib/db";
import { profiles as profilesSchema } from "@/drizzle/schema";
import { SearchFilters } from "@/types";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";
import { ProfileCard } from "@/components/landing/profile-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const BestProposalsPage = async ({ searchParams }: PageProps) => {
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

    const resolvedSearchParams = await searchParams;

    const currentPage = Number(resolvedSearchParams.page) || 1;
    const pageSize = 4;

    const filters = normalizeSearchFilters(resolvedSearchParams);

    const result = await getProfilesByFilters(filters, currentProfile?.id);
    const allProfiles = result.data || [];

    const totalPages = Math.ceil(allProfiles.length / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const profiles = allProfiles.slice(startIndex, startIndex + pageSize);

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

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(
            resolvedSearchParams as Record<string, string>,
        );
        params.set("page", pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <main className="w-full">
            <section className="flex flex-col gap-8">
                <FilterOptions mode="dashboard" />
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

                    {allProfiles.length > pageSize && (
                        <div className="flex items-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                asChild
                                disabled={currentPage <= 1}
                            >
                                {currentPage > 1 ? (
                                    <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
                                ) : (
                                    <span>Previous</span>
                                )}
                            </Button>

                            <span className="text-sm font-medium text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                asChild
                                disabled={currentPage >= totalPages}
                            >
                                {currentPage < totalPages ? (
                                    <Link href={createPageUrl(currentPage + 1)}>Next</Link>
                                ) : (
                                    <span>Next</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BestProposalsPage;
