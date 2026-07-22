import z from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { LocationNode, StepSevenInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    OnboardingFormValues,
    stepSevenPreferencesSchema,
} from "@/lib/validation";
import { useEffect, useMemo, useState } from "react";
import { MultiSelectField } from "@/components/landing/multi-select-combobox";
import {
    GROUPS_PROFESSIONS,
    LK_DATA,
    MARITAL_STATUSES,
    PERSONAL_DROPDOWNS,
    RELIGIONS_AND_CASTES,
} from "@/lib/constants";
import { Input } from "../ui/input";

type StepSevenValues = z.infer<typeof stepSevenPreferencesSchema>;

interface StepSevenProps {
    onPrev?: () => void;
    onNext: (data: StepSevenValues) => void;
    initialData: StepSevenInitialData["initialData"];
    variant?: "onboarding" | "inline";
}

const PartnerPreferences = ({
    onNext,
    onPrev,
    initialData,
    variant = "onboarding",
}: StepSevenProps) => {
    const {
        control,
        watch,
        register,
        setValue,
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepSevenPreferencesSchema as any),
        defaultValues: {
            minAge: initialData?.minAge || "",
            maxAge: initialData?.maxAge || "",
            maritalStatus: initialData?.maritalStatus ?? "never_married",
            educationLevels: initialData?.educationLevels ?? [],
            professions: initialData?.professions ?? [],
            annualIncomeRanges: initialData?.annualIncomeRanges ?? [],
            // lookingFor: initialData?.lookingFor || "",
            // religions: initialData?.religions || [],
            // castes: initialData?.castes || [],
            // countries: initialData?.countries || [],
            // states: initialData?.states || [],
        },
    });

    // const [apiCountries, setApiCountries] = useState<LocationNode[]>([]);
    // const [apiStates, setApiStates] = useState<LocationNode[]>([]);
    // const [loadingStates, setLoadingStates] = useState(false);

    // const selectedReligions = watch("religions") || [];
    // const selectedCountries = watch("countries") || [];

    // const religionOptions = useMemo(() => {
    //     return Object.keys(RELIGIONS_AND_CASTES).map((r) => ({
    //         label: r,
    //         value: r,
    //     }));
    // }, []);

    // const casteOptions = useMemo(() => {
    //     if (selectedReligions.length === 0) {
    //         // Fallback fallback: display all unique castes if no specific religion is toggled yet
    //         const allUniqueCastes = Array.from(
    //             new Set(Object.values(RELIGIONS_AND_CASTES).flat()),
    //         );
    //         return allUniqueCastes.map((c) => ({ label: c, value: c }));
    //     }
    //     const relevant = selectedReligions.flatMap(
    //         (r) => RELIGIONS_AND_CASTES[r] || [],
    //     );
    //     return Array.from(new Set(relevant)).map((c) => ({ label: c, value: c }));
    // }, [selectedReligions]);

    // const countryOptions = useMemo(() => {
    //     return apiCountries.map((c) => ({ label: c.value, value: c.value }));
    // }, [apiCountries]);

    // const stateOptions = useMemo(() => {
    //     return apiStates.map((s) => ({ label: s.value, value: s.value }));
    // }, [apiStates]);

    // useEffect(() => {
    //     if (selectedReligions.length > 0) {
    //         const currentSelectedCastes = watch("castes") || [];
    //         const validCastesForReligions = selectedReligions.flatMap(
    //             (r) => RELIGIONS_AND_CASTES[r] || [],
    //         );

    //         const filteredCastes = currentSelectedCastes.filter((caste) =>
    //             validCastesForReligions.includes(caste),
    //         );

    //         if (filteredCastes.length !== currentSelectedCastes.length) {
    //             setValue("castes", filteredCastes);
    //         }
    //     } else {
    //         setValue("castes", []);
    //     }
    // }, [selectedReligions, setValue, watch]);

    // useEffect(() => {
    //     fetch("/api/location?type=countries")
    //         .then((res) => res.json())
    //         .then((data) => setApiCountries(data))
    //         .catch((err) => console.error("Initial load failure:", err));
    // }, []);

    // useEffect(() => {
    //     if (selectedCountries.length === 0) {
    //         setApiStates([]);
    //         return;
    //     }

    //     const hasSriLanka =
    //         selectedCountries.includes("Sri Lanka") ||
    //         apiCountries.some(
    //             (c) => selectedCountries.includes(c.value) && c.isoCode === "LK",
    //         );

    //     if (hasSriLanka && selectedCountries.length === 1) {
    //         const lkDistricts = Object.keys(LK_DATA).map((district) => ({
    //             value: district,
    //             isoCode: district,
    //         }));
    //         setApiStates(lkDistricts);
    //         return;
    //     }

    //     const codes = selectedCountries
    //         .map((name) => apiCountries.find((c) => c.value === name)?.isoCode)
    //         .filter(Boolean);

    //     if (codes.length > 0) {
    //         setLoadingStates(true);
    //         // Fetching first matched country code for state listings as an array fallback
    //         fetch(`/api/location?type=states&countryCode=${codes[0]}`)
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 if (hasSriLanka) {
    //                     const lkDistricts = Object.keys(LK_DATA).map((d) => ({
    //                         value: d,
    //                         isoCode: d,
    //                     }));
    //                     setApiStates([...lkDistricts, ...data]);
    //                 } else {
    //                     setApiStates(data);
    //                 }
    //                 setLoadingStates(false);
    //             })
    //             .catch(() => setLoadingStates(false));
    //     }
    // }, [selectedCountries, apiCountries]);

    const professionOptions = useMemo(() => {
        return GROUPS_PROFESSIONS.flatMap((group) =>
            group.roles.map((role) => ({
                label: role,
                value: role,
                category: group.category,
            })),
        );
    }, []);

    const educationOptions = useMemo(() => {
        return PERSONAL_DROPDOWNS.education_levels.map((edu) => ({
            label: edu,
            value: edu,
        }));
    }, []);

    const incomeOptions = useMemo(() => {
        return PERSONAL_DROPDOWNS.annual_income_ranges.map((inc) => ({
            label: inc,
            value: inc,
        }));
    }, []);

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="minAge" className="text-sm font-medium text-slate-700 uppercase">
                        Min Age Required
                    </Label>
                    <Input
                        {...register("minAge")}
                        placeholder="18"
                        type="number"
                        min={18}
                        id="minAge"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="maxAge" className="text-sm font-medium text-slate-700 uppercase">
                        Max Age Required
                    </Label>
                    <Input
                        {...register("maxAge")}
                        placeholder="50"
                        type="number"
                        min={18}
                        id="minAge"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 uppercase">
                        Partner's Marriage Status Should be
                    </Label>
                    <Controller
                        control={control}
                        name="maritalStatus"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Marital Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {MARITAL_STATUSES.map((status) => (
                                            <SelectItem key={status.label} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.maritalStatus && (
                        <p className="text-sm text-red-600">
                            {errors.maritalStatus.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <MultiSelectField
                        control={control}
                        name="annualIncomeRanges"
                        label="Partner's Expected Annual Income Range"
                        placeholder="Select Income Ranges"
                        options={incomeOptions}
                    />
                    {errors.annualIncomeRanges && (
                        <p className="text-sm text-red-600">
                            {errors.annualIncomeRanges.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiSelectField
                    control={control}
                    name="professions"
                    label="Partner's Job Status Should be"
                    placeholder="Select Professions"
                    options={professionOptions}
                />

                <MultiSelectField
                    control={control}
                    name="educationLevels"
                    label="Partner's Minimum Education Level"
                    placeholder="Select Education Levels"
                    options={educationOptions}
                />
            </div>

            {/* NAVIGATION CONTROLS CONTROLLER SECTION */}
            <div className="w-full col-span-1 md:col-span-2 mt-4">
                {variant === "onboarding" ? (
                    <div className="flex items-center justify-between">
                        <Button
                            size="lg"
                            type="button"
                            onClick={onPrev}
                            variant="link"
                            className="w-fit uppercase rounded-xl py-3 pr-5 -ml-3 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <Button
                            size="lg"
                            type="submit"
                            variant="secondary"
                            disabled={isSubmitting || !isDirty}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            {isSubmitting ? "Processing..." : "Done"}
                        </Button>
                    </div>
                ) : (
                    <div className="justify-end flex">
                        <Button
                            size="lg"
                            type="submit"
                            variant="default"
                            disabled={isSubmitting || !isDirty}
                            className="min-w-35"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
};

export default PartnerPreferences;
