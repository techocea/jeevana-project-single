import { getProfilesByFilters } from "@/app/actions/profile-actions";
import BestProposalsTable from "@/components/dashboard/best-proposals-table";
import FilterOptions from "@/components/landing/filter-options";
import { SearchFilters } from "@/types";

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

    return (
        <main className="min-h-screen bg-linear-to-br from-transparent to-primary/45 p-4 lg:p-10">
            <section className="flex flex-col gap-8">
                <FilterOptions mode="dashboard" />
                <div className="flex-1 flex flex-col items-center gap-6 -mt-6 lg:mt-0">
                    <BestProposalsTable profiles={result.data || []} />
                </div>
            </section>
        </main>
    );
};

export default BestProposalsPage;
