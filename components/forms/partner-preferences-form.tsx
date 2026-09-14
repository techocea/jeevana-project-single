import z from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm, useFormContext, useFormState } from "react-hook-form";
import { StepSevenInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    VenusAndMars,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    OnboardingFormValues,
    stepSevenPreferencesSchema,
} from "@/lib/validation";
import {  useMemo} from "react";
import { MultiSelectField } from "@/components/landing/multi-select-combobox";
import {
    GROUPS_PROFESSIONS,
    MARITAL_STATUSES,
    PERSONAL_DROPDOWNS,
} from "@/lib/constants";

type StepSevenValues = z.infer<typeof stepSevenPreferencesSchema>;

export const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

interface StepSevenProps {
    onPrev?: () => void;
    onNext?: (data: StepSevenValues) => void;
    initialData: StepSevenInitialData["initialData"];
    variant: "onboarding" | "editing" | "admin";
}


function usePreferenceOptions() {
    const professionOptions = useMemo(
        () =>
            GROUPS_PROFESSIONS.flatMap((group) =>
                group.roles.map((role) => ({ label: role, value: role, category: group.category })),
            ),
        [],
    );

    const educationOptions = useMemo(
        () => PERSONAL_DROPDOWNS.education_levels.map((edu) => ({ label: edu, value: edu })),
        [],
    );

    const incomeOptions = useMemo(
        () => PERSONAL_DROPDOWNS.annual_income_ranges.map((inc) => ({ label: inc, value: inc })),
        [],
    );

    return { professionOptions, educationOptions, incomeOptions };
}

/* ------------------------------------------------------------------ */
/* Shared fieldset — min/max age, marital status, income/profession/    */
/* education multi-selects. Added error messages for min/max age that   */
/* were missing in the original (every other field had one).           */
/* ------------------------------------------------------------------ */
function PartnerPreferencesFieldset({
                                        control,
                                        errors,
                                        professionOptions,
                                        educationOptions,
                                        incomeOptions,
                                    }: {
    control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
    errors: Record<string, any>;
    professionOptions: { label: string; value: string; category: string }[];
    educationOptions: { label: string; value: string }[];
    incomeOptions: { label: string; value: string }[];
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="preferredMinAge" className="text-sm font-medium text-slate-700 uppercase">
                    Min Age Required
                </Label>
                <Controller
                    control={control}
                    name="preferredMinAge"
                    render={({ field }) => (
                        <Select
                            value={field.value ? field.value.toString() : ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {ageOptions.map((age) => (
                                        <SelectItem value={age.toString()} key={age}>
                                            {age}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.preferredMinAge && (
                    <p className="text-sm text-red-600">{errors.preferredMinAge.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="preferredMaxAge" className="text-sm font-medium text-slate-700 uppercase">
                    Max Age Required
                </Label>
                <Controller
                    control={control}
                    name="preferredMaxAge"
                    render={({ field }) => (
                        <Select
                            value={field.value ? field.value.toString() : ""}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {ageOptions.map((age) => (
                                        <SelectItem value={age.toString()} key={age}>
                                            {age}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.preferredMaxAge && (
                    <p className="text-sm text-red-600">{errors.preferredMaxAge.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 uppercase">
                    Partner's Marriage Status Should be
                </Label>
                <Controller
                    control={control}
                    name="preferredMaritalStatus"
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
                {errors.preferredMaritalStatus && (
                    <p className="text-sm text-red-600">{errors.preferredMaritalStatus.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <MultiSelectField
                    control={control}
                    name="preferredAnnualIncomeRanges"
                    label="Partner's Expected Annual Income Range"
                    placeholder="Select Income Ranges"
                    options={incomeOptions}
                />
                {errors.preferredAnnualIncomeRanges && (
                    <p className="text-sm text-red-600">{errors.preferredAnnualIncomeRanges.message as string}</p>
                )}
            </div>

            <MultiSelectField
                control={control}
                name="preferredProfessions"
                label="Partner's Job Status Should be"
                placeholder="Select Professions"
                options={professionOptions}
            />

            <MultiSelectField
                control={control}
                name="preferredEducationLevels"
                label="Partner's Minimum Education Level"
                placeholder="Select Education Levels"
                options={educationOptions}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* ONBOARDING — final step, button reads "Done" instead of "Next Step". */
/* ------------------------------------------------------------------ */
function PartnerPreferencesOnboarding({ onPrev, onNext, initialData }: StepSevenProps) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepSevenPreferencesSchema as any),
        defaultValues: {
            preferredMinAge: initialData?.preferredMinAge || 0,
            preferredMaxAge: initialData?.preferredMaxAge || 0,
            preferredMaritalStatus: initialData?.preferredMaritalStatus || "never_married",
            preferredEducationLevels: initialData?.preferredEducationLevels || [],
            preferredProfessions: initialData?.preferredProfessions || [],
            preferredAnnualIncomeRanges: initialData?.preferredAnnualIncomeRanges || [],
        },
    });

    const { professionOptions, educationOptions, incomeOptions } = usePreferenceOptions();

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full flex flex-col gap-6">
            <PartnerPreferencesFieldset
                control={control}
                errors={errors}
                professionOptions={professionOptions}
                educationOptions={educationOptions}
                incomeOptions={incomeOptions}
            />

            <div className="justify-end flex w-full mt-4">
                {onPrev && (
                    <Button
                        type="button"
                        size="lg"
                        variant="link"
                        className="w-fit uppercase rounded-xl py-3 pr-5 -ml-3"
                        onClick={onPrev}
                    >
                        Back
                    </Button>
                )}
                <Button size="lg" type="submit" variant="secondary" disabled={isSubmitting}>
                    Done <ArrowRight />
                </Button>
            </div>
        </form>
    );
}

/* ------------------------------------------------------------------ */
/* EDITING                                                              */
/* ------------------------------------------------------------------ */
function PartnerPreferencesEditing({ onNext, initialData }: StepSevenProps) {
    const {
        control,
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepSevenPreferencesSchema as any),
        defaultValues: {
            preferredMinAge: initialData?.preferredMinAge || 0,
            preferredMaxAge: initialData?.preferredMaxAge || 0,
            preferredMaritalStatus: initialData?.preferredMaritalStatus || "never_married",
            preferredEducationLevels: initialData?.preferredEducationLevels || [],
            preferredProfessions: initialData?.preferredProfessions || [],
            preferredAnnualIncomeRanges: initialData?.preferredAnnualIncomeRanges || [],
        },
    });

    const { professionOptions, educationOptions, incomeOptions } = usePreferenceOptions();

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
            <PartnerPreferencesFieldset
                control={control}
                errors={errors}
                professionOptions={professionOptions}
                educationOptions={educationOptions}
                incomeOptions={incomeOptions}
            />
            <div className="justify-end flex w-full mt-6">
                <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

/* ------------------------------------------------------------------ */
/* ADMIN — no <form>, no buttons, reads/writes shared context.          */
/* ------------------------------------------------------------------ */
function PartnerPreferencesAdmin(_props: StepSevenProps) {
    const { control } = useFormContext<OnboardingFormValues>();
    const { errors } = useFormState({ control });
    const { professionOptions, educationOptions, incomeOptions } = usePreferenceOptions();

    return (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <VenusAndMars size={26} className="text-secondary" />
                <h4 className="text-black font-newsreader text-xl">Partner Preferences</h4>
            </div>
            <PartnerPreferencesFieldset
                control={control}
                errors={errors}
                professionOptions={professionOptions}
                educationOptions={educationOptions}
                incomeOptions={incomeOptions}
            />
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Wrapper                                                              */
/* ------------------------------------------------------------------ */
const PartnerPreferences = ({ onNext, onPrev, initialData, variant = "onboarding" }: StepSevenProps) => {
    if (variant === "admin") {
        return <PartnerPreferencesAdmin variant={variant} initialData={initialData} />;
    }
    if (variant === "editing") {
        return <PartnerPreferencesEditing variant={variant} onNext={onNext} initialData={initialData} />;
    }
    return (
        <PartnerPreferencesOnboarding variant={variant} onPrev={onPrev} onNext={onNext} initialData={initialData} />
    );
};

export default PartnerPreferences;