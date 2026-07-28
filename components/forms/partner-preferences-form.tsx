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
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    VenusAndMars,
} from "lucide-react";
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

export const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

interface StepSevenProps {
    onPrev?: () => void;
    onNext?: (data: StepSevenValues) => void;
    initialData: StepSevenInitialData["initialData"];
    variant: "onboarding" | "editing" | "admin";
}

const PartnerPreferences = ({
    onNext,
    onPrev,
    initialData,
    variant = "onboarding",
}: StepSevenProps) => {
    const {
        control,
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepSevenPreferencesSchema as any),
        defaultValues: {
            preferredMinAge: initialData?.preferredMinAge || "",
            preferredMaxAge: initialData?.preferredMaxAge || "",
            preferredMaritalStatus: initialData?.preferredMaritalStatus ?? "never_married",
            preferredEducationLevels: initialData?.preferredEducationLevels ?? [],
            preferredProfessions: initialData?.preferredProfessions ?? [],
            preferredAnnualIncomeRanges: initialData?.preferredAnnualIncomeRanges ?? [],
        },
    });

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
        <div className="w-full">
            {variant === "onboarding" || variant === "editing" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="preferredMinAge"
                            className="text-sm font-medium text-slate-700 uppercase"
                        >
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
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="preferredMaxAge"
                            className="text-sm font-medium text-slate-700 uppercase"
                        >
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
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 uppercase">
                            Partner's Marriage Status Should be
                        </Label>
                        <Controller
                            control={control}
                            name="preferredMaritalStatus"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? ""}
                                >
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
                            <p className="text-sm text-red-600">
                                {errors.preferredMaritalStatus.message}
                            </p>
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
                            <p className="text-sm text-red-600">
                                {errors.preferredAnnualIncomeRanges.message}
                            </p>
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
            ) : (
                <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
                        <VenusAndMars size={26} className="text-secondary" />
                        <h4 className="text-black font-newsreader text-xl">
                            Partner Preferences
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="preferredMinAge"
                                className="text-sm font-medium text-slate-700 uppercase"
                            >
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
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="preferredMaxAge"
                                className="text-sm font-medium text-slate-700 uppercase"
                            >
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 uppercase">
                                Partner's Marriage Status Should be
                            </Label>
                            <Controller
                                control={control}
                                name="preferredMaritalStatus"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                    >
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
                                <p className="text-sm text-red-600">
                                    {errors.preferredMaritalStatus.message}
                                </p>
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
                                <p className="text-sm text-red-600">
                                    {errors.preferredAnnualIncomeRanges.message}
                                </p>
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
                </section>
            )}

            <div className="justify-end flex w-full col-span-2 mt-4">
                {variant === "onboarding" && onNext ? (
                    <>
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

                        <Button
                            size="lg"
                            type="button"
                            variant="secondary"
                            onClick={handleSubmit(onNext)}
                            disabled={isSubmitting}
                        >
                            Next Step <ArrowRight />
                        </Button>
                    </>
                ) : (
                    variant === "editing" &&
                    onNext && (
                        <Button
                            size="lg"
                            type="button"
                            variant="default"
                            onClick={handleSubmit(onNext)}
                            disabled={isSubmitting || !isDirty}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default PartnerPreferences;
