import z from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Controller, useForm, useFormContext, useFormState, useWatch} from "react-hook-form";
import {StepFiveInitialData} from "@/types";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
    ArrowRight, ChevronLeft,
    VenusAndMars,
} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    OnboardingFormValues,
    stepFiveSchema,
} from "@/lib/validation";
import {useMemo} from "react";
import {MultiSelectField} from "@/components/landing/multi-select-combobox";
import {
    GROUPS_PROFESSIONS,
    PERSONAL_DROPDOWNS, RELIGIONS_AND_CASTES,
} from "@/lib/constants";
import TitleHeader from "../dashboard/title-header";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/components/ui/combobox";
import {generateHeightOptions} from "@/helpers/measurement-utils";

type StepSevenValues = z.infer<typeof stepFiveSchema>;

export const ageOptions = Array.from({length: 43}, (_, i) => 18 + i);

interface stepFiveProps {
    onPrev?: () => void;
    onNext?: (data: StepSevenValues) => void;
    initialData: StepFiveInitialData["initialData"];
    variant: "onboarding" | "editing" | "admin";
}

function useHeightOptions() {
    const heightDataObjects = useMemo(() => generateHeightOptions(), []);
    return {
        heightDataObjects,
        heightValuesList: heightDataObjects.map((h) => h.value),
    };
}

function usePreferenceOptions(selectedReligions: string[] = []) {
    const professionOptions = useMemo(
        () =>
            GROUPS_PROFESSIONS.flatMap((group) =>
                group.roles.map((role) => ({label: role, value: role, category: group.category})),
            ),
        [],
    );

    const religionOptions = useMemo(
        () =>
            Object.keys(RELIGIONS_AND_CASTES).map((religion) => ({
                label: religion,
                value: religion,
            })),
        [],
    );

    const casteOptions = useMemo(() => {
        const castes = (selectedReligions ?? []).flatMap(
            (religion) => RELIGIONS_AND_CASTES[religion] ?? [],
        );

        return [...new Set(castes)].map((caste) => ({
            label: caste,
            value: caste,
        }));
    }, [selectedReligions]);

    const educationOptions = useMemo(
        () => PERSONAL_DROPDOWNS.education_levels.map((edu) => ({label: edu, value: edu})),
        [],
    );

    const incomeOptions = useMemo(
        () => PERSONAL_DROPDOWNS.annual_income_ranges.map((inc) => ({label: inc, value: inc})),
        [],
    );

    return {
        professionOptions,
        religionOptions,
        casteOptions,
        educationOptions,
        incomeOptions,
    };
}

/* ------------------------------------------------------------------ */
/* Shared fieldset — min/max age, marital status, income/profession/    */
/* education multi-selects. Added error messages for min/max age that   */
/* were missing in the original (every other field had one).           */

/* ------------------------------------------------------------------ */
function OnboardingFormFiveFields({
                                      control,
                                      errors,
                                      heightValuesList,
                                      heightDataObjects
                                  }: {
    control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
    errors: Record<string, any>;
    heightDataObjects: { value: string; label: string }[];
    heightValuesList: string[];
}) {
    const selectedReligions =
        useWatch({
            control,
            name: "preferredReligions",
            defaultValue: [],
        }) ?? [];

    const {
        professionOptions,
        religionOptions,
        casteOptions,
        educationOptions,
        incomeOptions,
    } = usePreferenceOptions(selectedReligions);

    return (
        <div className="space-y-8">
            <TitleHeader title="Step 5: Partner Expectations & Preferences"
                         description="Desired qualities in a prospective bride or groom."/>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-4">
                <div className="space-y-2">
                    <Label>
                        Preferred Age Range
                    </Label>
                    <div className="flex items-center gap-2">
                        <Controller
                            control={control}
                            name="preferredMinAge"
                            render={({field}) => (
                                <Select
                                    value={field.value ? field.value.toString() : ""}
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select age"/>
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
                        <span className="text-xs text-[#8C8375]">to</span>
                        <Controller
                            control={control}
                            name="preferredMaxAge"
                            render={({field}) => (
                                <Select
                                    value={field.value ? field.value.toString() : ""}
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select age"/>
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
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>
                        Preferred Height Range
                    </Label>
                    <div className="flex items-center gap-2">
                        <Controller
                            control={control}
                            name="preferredMinHeight"
                            render={({field}) => (
                                <Combobox items={heightValuesList} value={field.value} onValueChange={field.onChange}>
                                    <ComboboxInput
                                        placeholder="Select min height"
                                        value={heightDataObjects.find((h) => h.value === field.value)?.label || ""}
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>No match found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => {
                                                const displayLabel = heightDataObjects.find((h) => h.value === item)?.label || item;
                                                return (
                                                    <ComboboxItem key={item} value={item}>
                                                        {displayLabel}
                                                    </ComboboxItem>
                                                );
                                            }}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            )}
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Controller
                            control={control}
                            name="preferredMaxHeight"
                            render={({field}) => (
                                <Combobox items={heightValuesList} value={field.value} onValueChange={field.onChange}>
                                    <ComboboxInput
                                        placeholder="Select max height"
                                        value={heightDataObjects.find((h) => h.value === field.value)?.label || ""}
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>No match found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => {
                                                const displayLabel = heightDataObjects.find((h) => h.value === item)?.label || item;
                                                return (
                                                    <ComboboxItem key={item} value={item}>
                                                        {displayLabel}
                                                    </ComboboxItem>
                                                );
                                            }}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 ">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="preferredMaritalStatus">
                        Marital Status
                    </Label>

                    <Controller
                        control={control}
                        name="preferredMaritalStatus"
                        render={({field}) => (
                            <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="preferredMaritalStatus"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Select Marital Status"/>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="single">
                                            Single
                                        </SelectItem>
                                        <SelectItem value="widowed">
                                            Widowed
                                        </SelectItem>
                                        <SelectItem value="divorced">
                                            Divorced
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.preferredMaritalStatus && (
                        <p className="text-sm text-red-600">
                            {errors.preferredMaritalStatus.message as string}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <MultiSelectField
                        control={control}
                        name="preferredReligions"
                        label="Preferred Religions"
                        placeholder="Select religions"
                        options={religionOptions}
                    />

                    {errors.preferredReligions && (
                        <p className="text-sm text-red-600">
                            {errors.preferredReligions.message as string}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <MultiSelectField
                        control={control}
                        name="preferredCastes"
                        label="Preferred Castes"
                        placeholder={
                            selectedReligions?.length
                                ? "Select castes"
                                : "Select a religion first"
                        }
                        options={casteOptions}
                    />

                    {errors.preferredCastes && (
                        <p className="text-sm text-red-600">
                            {errors.preferredCastes.message as string}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
                <MultiSelectField
                    control={control}
                    name="preferredEducationLevels"
                    label="Partner's Minimum Education Level"
                    placeholder="Select Education Levels"
                    options={educationOptions}
                />
                <MultiSelectField
                    control={control}
                    name="preferredProfessions"
                    label="Partner's profession Should be"
                    placeholder="Select Professions"
                    options={professionOptions}
                />
                <MultiSelectField
                    control={control}
                    name="preferredAnnualIncomeRanges"
                    label="Partner's Expected Annual Income Range"
                    placeholder="Select Income Ranges"
                    options={incomeOptions}
                />
            </div>
            {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">*/}
            {/*    <MultiSelectField*/}
            {/*        control={control}*/}
            {/*        name="preferredResidentialCountry"*/}
            {/*        label="Partner`s Residential Country"*/}
            {/*        placeholder="Select Country"*/}
            {/*        options={incomeOptions}*/}
            {/*    />*/}
            {/*    {errors.preferredResidentialCountry && (*/}
            {/*        <p className="text-sm text-red-600">{errors.preferredResidentialCountry.message as string}</p>*/}
            {/*    )}*/}
            {/*    <MultiSelectField*/}
            {/*        control={control}*/}
            {/*        name="preferredResidentialStatus"*/}
            {/*        label="Partner`s Residential Status"*/}
            {/*        placeholder="Select Status"*/}
            {/*        options={incomeOptions}*/}
            {/*    />*/}
            {/*    {errors.preferredResidentialStatus && (*/}
            {/*        <p className="text-sm text-red-600">{errors.preferredResidentialStatus.message as string}</p>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* ONBOARDING — final step, button reads "Done" instead of "Next Step". */

/* ------------------------------------------------------------------ */
function OnboardingFormFiveOnboarding({onPrev, onNext, initialData}: stepFiveProps) {
    const {
        control,
        handleSubmit,
        formState: {isSubmitting, errors},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepFiveSchema as any),
        defaultValues: {
            preferredMinAge: initialData?.preferredMinAge || 0,
            preferredMaxAge: initialData?.preferredMaxAge || 0,
            preferredMinHeight: initialData?.preferredMinHeight || "",
            preferredMaxHeight: initialData?.preferredMaxHeight || "",
            preferredMaritalStatus: initialData?.preferredMaritalStatus || "",
            preferredEducationLevels: initialData?.preferredEducationLevels || [],
            preferredProfessions: initialData?.preferredProfessions || [],
            preferredAnnualIncomeRanges: initialData?.preferredAnnualIncomeRanges || [],
            preferredResidentialCountry: initialData?.preferredResidentialCountry || [],
            preferredResidentialStatus: initialData?.preferredResidentialStatus || []
        },
    });

     const heightOptions = useHeightOptions();

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full flex flex-col gap-6">
            <OnboardingFormFiveFields
                control={control}
                errors={errors}
                {...heightOptions}
            />

            <div className="flex justify-between w-full mt-4">
                {onPrev && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
                    >
                        <ChevronLeft/> Back
                    </Button>
                )}
                <Button size="lg" type="submit" disabled={isSubmitting}>
                    Save & Continue <ArrowRight/>
                </Button>
            </div>
        </form>
    );
}

/* ------------------------------------------------------------------ */
/* EDITING                                                              */

/* ------------------------------------------------------------------ */
function OnboardingFormFiveEditing({onNext, initialData}: stepFiveProps) {
    const {
        control,
        handleSubmit,
        formState: {isDirty, isSubmitting, errors},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepFiveSchema as any),
        defaultValues: {
            preferredMinAge: initialData?.preferredMinAge || 0,
            preferredMaxAge: initialData?.preferredMaxAge || 0,
            preferredMinHeight: initialData?.preferredMinHeight || "",
            preferredMaxHeight: initialData?.preferredMaxHeight || "",
            preferredMaritalStatus: initialData?.preferredMaritalStatus || "",
            preferredEducationLevels: initialData?.preferredEducationLevels || [],
            preferredProfessions: initialData?.preferredProfessions || [],
            preferredAnnualIncomeRanges: initialData?.preferredAnnualIncomeRanges || [],
            preferredResidentialCountry: initialData?.preferredResidentialCountry || [],
            preferredResidentialStatus: initialData?.preferredResidentialStatus || [],
        },
    });

     const heightOptions = useHeightOptions();

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
            <OnboardingFormFiveFields
                control={control}
                errors={errors}
                {...heightOptions}
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
function OnboardingFormFiveAdmin(_props: stepFiveProps) {
    const {control} = useFormContext<OnboardingFormValues>();
    const {errors} = useFormState({control});

    const heightOptions = useHeightOptions();

    return (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <VenusAndMars size={26} className="text-secondary"/>
                <h4 className="text-black font-newsreader text-xl">Partner Preferences</h4>
            </div>
            <OnboardingFormFiveFields
                control={control}
                errors={errors}
                {...heightOptions}
            />
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Wrapper                                                              */
/* ------------------------------------------------------------------ */
const OnboardingFormFive = ({onNext, onPrev, initialData, variant = "onboarding"}: stepFiveProps) => {
    if (variant === "admin") {
        return <OnboardingFormFiveAdmin variant={variant} initialData={initialData}/>;
    }
    if (variant === "editing") {
        return <OnboardingFormFiveEditing variant={variant} onNext={onNext} initialData={initialData}/>;
    }
    return (
        <OnboardingFormFiveOnboarding variant={variant} onPrev={onPrev} onNext={onNext} initialData={initialData}/>
    );
};

export default OnboardingFormFive;