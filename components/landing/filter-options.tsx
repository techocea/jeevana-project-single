"use client";

import {useEffect, useId, useState, useTransition} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {
    ArrowDownWideNarrow,
    Check,
    ImageIcon,
    Loader2,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {Checkbox} from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";

import {RELIGIONS_AND_CASTES} from "@/lib/constants";

type SortBy = "recent" | "age_asc" | "age_desc";

type FilterFormValues = {
    search: string;
    religion: string;
    country: string;
    verifiedOnly: boolean;
    photosOnly: boolean;
    sortBy: SortBy;
};

type Option = {
    label: string;
    value: string;
};

type FilterOptionsProps = {
    countryOptions?: Option[];

    /**
     * Pass the total returned by your filtered database query.
     * Do not use the length of a single paginated page.
     */
    totalResults?: number;
};

const EMPTY_FILTERS: FilterFormValues = {
    search: "",
    religion: "",
    country: "",
    verifiedOnly: false,
    photosOnly: false,
    sortBy: "recent",
};

const FILTER_KEYS = [
    "search",
    "religion",
    "country",
    "verifiedOnly",
    "photosOnly",
    "sortBy",
] as const;

const ALL_OPTION = "__all__";

const religionOptions: Option[] = Object.keys(
    RELIGIONS_AND_CASTES,
).map((religion) => ({
    label: religion,
    value: religion,
}));

const sortOptions: { label: string; value: SortBy }[] = [
    {label: "Recently joined", value: "recent"},
    {label: "Age: youngest first", value: "age_asc"},
    {label: "Age: oldest first", value: "age_desc"},
];

function readFilters(params: URLSearchParams): FilterFormValues {
    const sort = params.get("sortBy");

    return {
        search: params.get("search") ?? "",
        religion: params.get("religion") ?? "",
        country: params.get("country") ?? "",
        verifiedOnly: params.get("verifiedOnly") === "true",
        photosOnly: params.get("photosOnly") === "true",
        sortBy:
            sort === "age_asc" || sort === "age_desc"
                ? sort
                : "recent",
    };
}

function countFilters(values: FilterFormValues) {
    return [
        values.search.trim(),
        values.religion,
        values.country,
        values.verifiedOnly,
        values.photosOnly,
    ].filter(Boolean).length;
}

type FilterSelectProps = {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    allowAll?: boolean;
    disabled?: boolean;
};

function FilterSelect({
                          label,
                          value,
                          options,
                          onChange,
                          placeholder = "All",
                          allowAll = true,
                          disabled = false,
                      }: FilterSelectProps) {
    const id = useId();

    return (
        <div className="min-w-0 space-y-2">
            <Label
                htmlFor={id}
                className="text-xs font-medium text-card-foreground/70"
            >
                {label}
            </Label>

            <Select
                value={allowAll ? value || ALL_OPTION : value}
                onValueChange={(nextValue) =>
                    onChange(
                        nextValue === ALL_OPTION ? "" : nextValue,
                    )
                }
                disabled={disabled}
            >
                <SelectTrigger
                    id={id}
                    className="h-10 w-full min-w-0 border-input bg-card text-sm text-card-foreground shadow-none"
                >
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>

                <SelectContent>
                    {allowAll && (
                        <SelectItem value={ALL_OPTION}>
                            {placeholder}
                        </SelectItem>
                    )}

                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default function FilterOptions({
                                          countryOptions = [],
                                          totalResults,
                                      }: FilterOptionsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const searchId = useId();
    const verifiedId = useId();
    const photosId = useId();

    const queryString = searchParams.toString();
    const appliedFilters = readFilters(
        new URLSearchParams(queryString),
    );

    const {control, register, handleSubmit, reset, setValue} =
        useForm<FilterFormValues>({
            defaultValues: appliedFilters,
        });

    // Keep the form aligned with browser back/forward navigation.
    useEffect(() => {
        reset(readFilters(new URLSearchParams(queryString)));
    }, [queryString, reset]);

    const activeFilterCount = countFilters(appliedFilters);

    const navigateWithFilters = (values: FilterFormValues) => {
        const params = new URLSearchParams(queryString);

        // Preserve unrelated query parameters.
        FILTER_KEYS.forEach((key) => params.delete(key));

        const search = values.search.trim();

        if (search) params.set("search", search);
        if (values.religion) {
            params.set("religion", values.religion);
        }
        if (values.country) {
            params.set("country", values.country);
        }
        if (values.verifiedOnly) {
            params.set("verifiedOnly", "true");
        }
        if (values.photosOnly) {
            params.set("photosOnly", "true");
        }
        if (values.sortBy !== "recent") {
            params.set("sortBy", values.sortBy);
        }

        // Filtering starts again from the first page.
        // Rename this if your project uses a different page parameter.
        params.delete("page");

        const query = params.toString();

        startTransition(() => {
            router.replace(
                query ? `${pathname}?${query}` : pathname,
                {scroll: false},
            );
        });
    };

    const onSubmit = (values: FilterFormValues) => {
        const nextValues = {
            ...values,
            search: values.search.trim(),
        };

        reset(nextValues);
        navigateWithFilters(nextValues);
        setDrawerOpen(false);
    };

    const clearAll = () => {
        reset({...EMPTY_FILTERS});
        navigateWithFilters({...EMPTY_FILTERS});
        setDrawerOpen(false);
    };

    const removeFilter = (
        key:
            | "search"
            | "religion"
            | "country"
            | "verifiedOnly"
            | "photosOnly",
    ) => {
        const nextValues = {...appliedFilters};

        if (key === "verifiedOnly" || key === "photosOnly") {
            nextValues[key] = false;
        } else {
            nextValues[key] = "";
        }

        reset(nextValues);
        navigateWithFilters(nextValues);
    };

    const countryLabel =
        countryOptions.find(
            (option) => option.value === appliedFilters.country,
        )?.label ?? appliedFilters.country;

    const chips: {
        key:
            | "search"
            | "religion"
            | "country"
            | "verifiedOnly"
            | "photosOnly";
        label: string;
    }[] = [];

    if (appliedFilters.search) {
        chips.push({
            key: "search",
            label: `Search: ${appliedFilters.search}`,
        });
    }

    if (appliedFilters.religion) {
        chips.push({
            key: "religion",
            label: appliedFilters.religion,
        });
    }

    if (appliedFilters.country) {
        chips.push({
            key: "country",
            label: countryLabel,
        });
    }

    if (appliedFilters.verifiedOnly) {
        chips.push({
            key: "verifiedOnly",
            label: "NIC verified",
        });
    }

    if (appliedFilters.photosOnly) {
        chips.push({
            key: "photosOnly",
            label: "Visible photo",
        });
    }

    const renderSelectFields = () => (
        <>
            <Controller
                control={control}
                name="religion"
                render={({field}) => (
                    <FilterSelect
                        label="Religion"
                        value={field.value}
                        onChange={field.onChange}
                        options={religionOptions}
                        placeholder="All religions"
                        disabled={isPending}
                    />
                )}
            />

            <Controller
                control={control}
                name="country"
                render={({field}) => (
                    <FilterSelect
                        label="Country of residence"
                        value={field.value}
                        onChange={field.onChange}
                        options={countryOptions}
                        placeholder={
                            countryOptions.length
                                ? "All countries"
                                : "No country options provided"
                        }
                        disabled={
                            isPending || countryOptions.length === 0
                        }
                    />
                )}
            />

            <Controller
                control={control}
                name="sortBy"
                render={({field}) => (
                    <FilterSelect
                        label="Sort results"
                        value={field.value}
                        onChange={field.onChange}
                        options={sortOptions}
                        allowAll={false}
                        disabled={isPending}
                    />
                )}
            />
        </>
    );

    return (
        <section
            aria-label="Filter proposals"
            aria-busy={isPending}
            className="overflow-hidden rounded-xl border border-input bg-card text-card-foreground shadow-sm"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 p-4 sm:p-5"
            >
                {/* Search and mobile drawer trigger */}
                <div className="space-y-4">
                    {/* Search field */}
                    <div className="relative">
                        <Label htmlFor={searchId} className="sr-only">
                            Search profiles
                        </Label>

                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-card-foreground/45"
                        />

                        <Input
                            {...register("search")}
                            id={searchId}
                            type="search"
                            placeholder="Search occupation, education, city..."
                            disabled={isPending}
                            className="h-11 border-input bg-background/60 pl-10 pr-10 text-sm text-card-foreground shadow-none"
                        />
                    </div>

                    {/* Desktop filters */}
                    <div className="hidden grid-cols-3 gap-4 lg:grid">
                        {renderSelectFields()}
                    </div>

                    {/* Mobile filters */}
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => setDrawerOpen(true)}
                        className="h-11 w-full gap-2 border-input text-card-foreground lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px]">
                {activeFilterCount}
            </span>
                        )}
                    </Button>
                </div>

                {/* Quick filters and submit */}
                <div
                    className="flex flex-col gap-4 border-t border-input/70 pt-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Controller
                            control={control}
                            name="verifiedOnly"
                            render={({field}) => (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={verifiedId}
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(
                                                checked === true,
                                            )
                                        }
                                        disabled={isPending}
                                    />

                                    <Label
                                        htmlFor={verifiedId}
                                        className="flex cursor-pointer items-center gap-1.5 text-xs font-normal text-card-foreground/80"
                                    >
                                        <ShieldCheck
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5 text-primary"
                                        />
                                        NIC verified
                                    </Label>
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="photosOnly"
                            render={({field}) => (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={photosId}
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(
                                                checked === true,
                                            )
                                        }
                                        disabled={isPending}
                                    />

                                    <Label
                                        htmlFor={photosId}
                                        className="flex cursor-pointer items-center gap-1.5 text-xs font-normal text-card-foreground/80"
                                    >
                                        <ImageIcon
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5 text-primary"
                                        />
                                        With visible photo
                                    </Label>
                                </div>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3 xl:justify-end">
                        {typeof totalResults === "number" && (
                            <p
                                role="status"
                                className="text-xs tabular-nums text-card-foreground/60"
                            >
                                <span className="font-semibold text-card-foreground">
                                    {totalResults.toLocaleString()}
                                </span>{" "}
                                matching{" "}
                                {totalResults === 1
                                    ? "profile"
                                    : "profiles"}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-10 gap-2 bg-primary px-5 text-accent-foreground hover:bg-primary/90"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (
                                <Search className="h-4 w-4"/>
                            )}
                            {isPending
                                ? "Applying..."
                                : "Apply filters"}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Applied URL filters */}
            {chips.length > 0 && (
                <div
                    className="flex flex-wrap items-center gap-2 border-t border-input/70 bg-background/60 px-4 py-3 sm:px-5">
                    <span className="mr-1 text-[11px] font-medium text-card-foreground/55">
                        Applied:
                    </span>

                    {chips.map((chip) => (
                        <button
                            key={chip.key}
                            type="button"
                            disabled={isPending}
                            onClick={() => removeFilter(chip.key)}
                            aria-label={`Remove ${chip.label} filter`}
                            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-input bg-card px-2.5 py-1 text-xs text-card-foreground/80 transition-colors hover:border-secondary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                            <span className="truncate">
                                {chip.label}
                            </span>
                            <X
                                aria-hidden="true"
                                className="h-3 w-3 shrink-0"
                            />
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={clearAll}
                        disabled={isPending}
                        className="rounded px-1.5 py-1 text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Mobile filters */}
            <Drawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                <DrawerContent className="max-h-[90dvh] border-input bg-card text-card-foreground">
                    <div className="mx-auto flex w-full max-w-lg flex-col overflow-y-auto">
                        <DrawerHeader className="text-left">
                            <DrawerTitle className="flex items-center gap-2 text-base">
                                <ArrowDownWideNarrow className="h-4 w-4 text-primary"/>
                                Refine your search
                            </DrawerTitle>

                            <DrawerDescription className="text-card-foreground/60">
                                Choose your preferences, then apply
                                them to update the results.
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="space-y-5 px-4 pb-6">
                            {renderSelectFields()}
                        </div>

                        <div
                            className="flex gap-3 border-t border-input bg-card px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={clearAll}
                                className="h-11 border-input text-card-foreground"
                            >
                                Reset all
                            </Button>

                            <Button
                                type="button"
                                disabled={isPending}
                                onClick={handleSubmit(onSubmit)}
                                className="h-11 flex-1 gap-2 bg-primary text-accent-foreground hover:bg-primary/90"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                ) : (
                                    <Check className="h-4 w-4"/>
                                )}
                                Apply filters
                            </Button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </section>
    );
}