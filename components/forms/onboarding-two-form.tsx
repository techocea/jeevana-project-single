import {z} from "zod";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import {useMemo} from "react";
import {useForm, Controller, useFormContext, useFormState} from "react-hook-form";
import {StepTwoInitialData} from "@/types";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {OnboardingFormValues, stepTwoSchema} from "@/lib/validation";
import {ChevronLeft} from "lucide-react"
import {MdTempleBuddhist} from "react-icons/md";
import TitleHeader from "@/components/dashboard/title-header";
import {
    generateHeightOptions,
    generateWeightOptions,
} from "@/helpers/measurement-utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {BLOOD_GROUPS,BODY_TYPES, COMPLEXION_TYPES} from "@/lib/constants";

type StepTwoValues = z.infer<typeof stepTwoSchema>;

interface StepTwoProps {
    onPrev?: () => void;
    onNext?: (data: StepTwoValues) => void;
    initialData: StepTwoInitialData["initialData"];
    variant?: "onboarding" | "editing" | "admin";
}

function useHeightWeightOptions() {
    const heightDataObjects = useMemo(() => generateHeightOptions(), []);
    const weightDataObjects = useMemo(() => generateWeightOptions(), []);
    return {
        heightDataObjects,
        weightDataObjects,
        heightValuesList: heightDataObjects.map((h) => h.value),
        weightValuesList: weightDataObjects.map((w) => w.value),
    };
}


function OnboardingFormTwoFields({
                                     register,
                                     control,
                                     errors,
                                     watch,
                                     heightDataObjects,
                                     weightDataObjects,
                                     heightValuesList,
                                     weightValuesList,
                                 }: {
    errors: Record<string, any>;
    control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
    register: ReturnType<typeof useForm<OnboardingFormValues>>["register"];
    watch: ReturnType<typeof useForm<OnboardingFormValues>>["watch"];
    heightDataObjects: { value: string; label: string }[];
    weightDataObjects: { value: string; label: string }[];
    heightValuesList: string[];
    weightValuesList: string[];
}) {
    return (
        <div
            className="space-y-8"
        >
            <TitleHeader title=" Step 2: Physical Attributes & Habits"
                         description="Helps prospective families assess compatibility of values, lineage, and upbringing."/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <Label
                        htmlFor="complexion"
                    >
                        Complexion
                    </Label>
                    <Controller
                        name="complexion"
                        control={control}
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select complexion"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPLEXION_TYPES.map((item)=>(
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.complexion && (
                        <p className="text-xs text-red-500">
                            {errors.complexion.message as string}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <Label
                        htmlFor="bodyType"
                    >
                        Body Type
                    </Label>
                    <Controller
                        name="bodyType"
                        control={control}
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select body type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectContent>
                                        {BODY_TYPES.map((item)=>(
                                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.bodyType && (
                        <p className="text-xs text-red-500">
                            {errors.bodyType.message as string}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <Label
                        htmlFor="bloodGroup"
                    >
                        Blood Group
                    </Label>
                    <Controller
                        name="bloodGroup"
                        control={control}
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select blood group"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectContent>
                                        {BLOOD_GROUPS.map((item)=>(
                                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.bloodGroup && (
                        <p className="text-xs text-red-500">
                            {errors.bloodGroup.message as string}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="height">
                        Height
                    </Label>
                    <Controller
                        control={control}
                        name="height"
                        render={({field}) => (
                            <Combobox items={heightValuesList} value={field.value} onValueChange={field.onChange}>
                                <ComboboxInput
                                    placeholder="Select Height"
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
                    {errors.height && <p className="text-sm text-red-600">{errors.height.message as string}</p>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="weight">
                        Weight
                    </Label>
                    <Controller
                        control={control}
                        name="weight"
                        render={({field}) => (
                            <Combobox items={weightValuesList} value={field.value} onValueChange={field.onChange}>
                                <ComboboxInput
                                    placeholder="Select Weight"
                                    value={weightDataObjects.find((w) => w.value === field.value)?.label || ""}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => {
                                            const displayLabel = weightDataObjects.find((w) => w.value === item)?.label || item;
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
                    {errors.weight && <p className="text-sm text-red-600">{errors.weight.message as string}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <Label>Smoking Habits</Label>
                    <Controller
                        control={control}
                        name="smoking"
                        defaultValue="never"
                        render={({field}) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value ?? "never"}
                                        className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="never" id="s1"/>
                                    <Label htmlFor="s1" className="font-normal text-accent-foreground">Never</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="occasionally" id="s2"/>
                                    <Label htmlFor="s2"
                                           className="font-normal text-accent-foreground">Occasionally</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="regularly" id="s3"/>
                                    <Label htmlFor="s3" className="font-normal text-accent-foreground">Regularly</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.smoking && <p className="text-sm text-red-600">{errors.smoking.message as string}</p>}
                </div>
                <div className="space-y-3">
                    <Label>Drinking Habits</Label>
                    <Controller
                        control={control}
                        name="drinking"
                        defaultValue="never"
                        render={({field}) => (
                            <RadioGroup value={field.value ?? "never"} onValueChange={field.onChange}
                                        className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="never" id="d1"/>
                                    <Label htmlFor="d1"
                                           className="font-normal text-accent-foreground">Non-drinker</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="occasionally" id="d2"/>
                                    <Label htmlFor="d2"
                                           className="font-normal text-accent-foreground">Occasionally</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="regularly" id="d3"/>
                                    <Label htmlFor="d3" className="font-normal text-accent-foreground">Regularly</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.drinking && <p className="text-sm text-red-600">{errors.drinking.message as string}</p>}
                </div>
                <div className="space-y-3">
                    <Label>Food Preferences</Label>
                    <Controller
                        control={control}
                        name="foodPreferences"
                        defaultValue="vegetarian"
                        render={({field}) => (
                            <RadioGroup value={field.value ?? "vegetarian"} onValueChange={field.onChange}
                                        className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vegetarian" id="f1"/>
                                    <Label htmlFor="f1"
                                           className="font-normal text-accent-foreground">Vegetarian</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="non-vegetarian" id="f2"/>
                                    <Label htmlFor="f2"
                                           className="font-normal text-accent-foreground">Non-Vegetarian</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vegan" id="f3"/>
                                    <Label htmlFor="f3" className="font-normal text-accent-foreground">Vegan</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.foodPreferences && (
                        <p className="text-sm text-red-600">{errors.foodPreferences.message as string}</p>
                    )}
                </div>
            </div>
            <div>
                <div className="flex gap-6 items-center w-full">
                    <div className="space-y-3">
                        <Label>Differently Abled?</Label>
                        <Controller
                            control={control}
                            name="isDifferentlyAbled"
                            render={({field}) => (
                                <RadioGroup
                                    value={field.value === true ? "yes" : "no"}
                                    onValueChange={(val) => field.onChange(val === "yes")}
                                    className="flex flex-row gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="differently-abled-yes"/>
                                        <Label htmlFor="differently-abled-yes"
                                               className="font-normal text-accent-foreground">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="differently-abled-no"/>
                                        <Label htmlFor="differently-abled-no"
                                               className="font-normal text-accent-foreground">No</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>
                    {watch("isDifferentlyAbled") === true && (
                        <div className="pt-2 animate-in fade-in duration-200 w-full">
                            {/* FIX: this was a bare <Input> with no name/value binding before —
                differentlyAbledDetails was silently dropped on every submit. */}
                            <Input
                                placeholder="Please specify any assistance or details needed"
                                {...register("differentlyAbledDetails")}
                            />
                        </div>
                    )}
                    {errors.isDifferentlyAbled && (
                        <p className="text-sm text-red-600">{errors.isDifferentlyAbled.message as string}</p>
                    )}
                </div>
            </div>
        </div>
    );
}



function OnboardingFormTwoOnboarding({onPrev, onNext, initialData}: StepTwoProps) {
    const {
        watch,
        control,
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepTwoSchema as any),
        defaultValues: {
            height: initialData?.height ? String(initialData.height) : "",
            weight: initialData?.weight ? String(initialData.weight) : "",
            smoking: initialData?.smoking || "never",
            complexion: initialData?.complexion || "not_specified",
            bodyType: initialData?.bodyType || "not_specified",
            bloodGroup: initialData?.bloodGroup || "not_specified",
            drinking: initialData?.drinking || "never",
            foodPreferences: initialData?.foodPreferences || undefined,
            isDifferentlyAbled: initialData?.isDifferentlyAbled || undefined,
            differentlyAbledDetails: initialData?.differentlyAbledDetails || undefined,
        },
    });

    const heightWeight = useHeightWeightOptions();

    return (
        <form
            onSubmit={handleSubmit((data) => onNext?.(data))}
            className="w-full flex flex-col gap-6"
        >
            <OnboardingFormTwoFields
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                {...heightWeight}
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

function OnboardingFormTwoEditing({onNext, initialData}: StepTwoProps) {
    const {
        watch,
        control,
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepTwoSchema as any),
        defaultValues: {
            height: initialData?.height ? String(initialData.height) : "",
            weight: initialData?.weight ? String(initialData.weight) : "",
            smoking: initialData?.smoking || "never",
            complexion: initialData?.complexion || "not_specified",
            bodyType: initialData?.bodyType || "not_specified",
            bloodGroup: initialData?.bloodGroup || "not_specified",
            drinking: initialData?.drinking || "never",
            foodPreferences: initialData?.foodPreferences || undefined,
            isDifferentlyAbled: initialData?.isDifferentlyAbled || undefined,
            differentlyAbledDetails: initialData?.differentlyAbledDetails || undefined,
        },
    });

    const heightWeight = useHeightWeightOptions();

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
            <OnboardingFormTwoFields
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                {...heightWeight}
            />
            <div className="justify-end flex w-full mt-6">
                <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

function OnboardingFormTwoAdmin(_props: StepTwoProps) {
    const {watch, control, register} = useFormContext<OnboardingFormValues>();
    const {errors} = useFormState({control});

    const heightWeight = useHeightWeightOptions();

    return (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <MdTempleBuddhist size={26} className="text-secondary"/>
                <h4 className="text-black font-newsreader text-xl">Religion</h4>
            </div>

            <OnboardingFormTwoFields
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                {...heightWeight}
            />
        </section>
    );
}

const OnboardingFormTwo = ({
                               onNext,
                               onPrev,
                               initialData,
                               variant = "onboarding",
                           }: StepTwoProps) => {
    if (variant === "admin") {
        return <OnboardingFormTwoAdmin variant={variant} initialData={initialData}/>;
    }
    if (variant === "editing") {
        return (
            <OnboardingFormTwoEditing variant={variant} onNext={onNext} initialData={initialData}/>
        );
    }
    return (
        <OnboardingFormTwoOnboarding
            variant={variant}
            onPrev={onPrev}
            onNext={onNext}
            initialData={initialData}
        />
    );
};

export default OnboardingFormTwo;
