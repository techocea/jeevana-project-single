import {z} from "zod";
import {Controller, useForm, useFormContext, useFormState} from "react-hook-form";
import {StepFourInitialData} from "@/types";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ArrowRight, ChevronLeft, Loader2, Map} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {OnboardingFormValues, stepFourSchema} from "@/lib/validation";
import TitleHeader from "@/components/dashboard/title-header";
import {Textarea} from "@/components/ui/textarea";
import ImageUploadZone from "@/components/landing/image-upload";

type StepFourValues = z.infer<typeof stepFourSchema>;

interface StepFourProps {
    onPrev?: () => void;
    onNext?: (data: StepFourValues) => void;
    initialData: StepFourInitialData["initialData"];
    variant?: "onboarding" | "editing" | "admin";
}

function OnboardingFormFourFieldset({
                                        control,
                                        errors,
                                        register
                                    }: {
    control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
    register: ReturnType<typeof useForm<OnboardingFormValues>>["register"];
    errors: Record<string, any>;
}) {


    return (
        <div className="space-y-8">
            <TitleHeader title="Step 4: About Me & Photograph"
                         description="Describe personality and lifestyle. Photo visibility can be kept strictly confidential."/>

            <div className="flex flex-col gap-2">
                <Label htmlFor="narrative">
                    About Me
                </Label>
                <Textarea id="narrative"
                          {...register("narrative")}
                          rows={4}
                          placeholder="Write a courteous overview  of personality, lifestyle, family, family values,and what you cherish in life..." {...register("narrative")}/>
                <span className="text-muted-foreground text-[10px]">Do NOT include private phone numbers, physical residential addresses, or personal emails here.</span>
                {errors.narrative && <p className="text-sm text-red-600">{errors.narrative.message as string}</p>}
            </div>
                <Controller
                    control={control}
                    name="profilePic"
                    render={({field: imageField, fieldState: imageState}) => (
                        <Controller
                            control={control}
                            name="photoVisible"
                            render={({
                                         field: visibilityField,
                                         fieldState: visibilityState,
                                     }) => (
                                <div className="space-y-2">
                                    <ImageUploadZone
                                        value={imageField.value}
                                        onChange={imageField.onChange}
                                        photoVisible={visibilityField.value ?? false}
                                        onPhotoVisibleChange={visibilityField.onChange}
                                    />

                                    {imageState.error && (
                                        <p role="alert" className="text-sm text-destructive">
                                            {imageState.error.message}
                                        </p>
                                    )}

                                    {visibilityState.error && (
                                        <p role="alert" className="text-sm text-destructive">
                                            {visibilityState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    )}
                />
        </div>
    );
}

function OnboardingFormFourOnboarding({onPrev, onNext, initialData}: StepFourProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepFourSchema as any),
        defaultValues: {
            narrative: initialData?.narrative || "",
            profilePic: initialData?.profilePic ?? "",
            photoVisible: initialData?.photoVisible ?? false,
        },
    });


    return (
        <form
            onSubmit={handleSubmit((data) => onNext?.(data))}
            className="w-full flex flex-col gap-6"
        >
            <OnboardingFormFourFieldset
                register={register}
                control={control}
                errors={errors}
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

function OnboardingFormFourEditing({onNext, initialData}: StepFourProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepFourSchema as any),
        defaultValues: {
            narrative: initialData?.narrative || "",
            profilePic: initialData?.profilePic ?? "",
            photoVisible: initialData?.photoVisible ?? false,
        },
    });


    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
            <OnboardingFormFourFieldset
                register={register}
                control={control}
                errors={errors}
            />
            <div className="justify-end flex w-full mt-6">
                <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

function OnboardingFormFourAdmin(_props: StepFourProps) {
    const {control, register} = useFormContext<OnboardingFormValues>();
    const {errors} = useFormState({control});

    return (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Map size={26} className="text-secondary"/>
                <h4 className="text-black font-newsreader text-xl">Location</h4>
            </div>
            <OnboardingFormFourFieldset
                register={register}
                control={control}
                errors={errors}
            />
        </section>
    );
}

const OnboardingFormFour = ({onNext, onPrev, initialData, variant = "onboarding"}: StepFourProps) => {
    if (variant === "admin") {
        return <OnboardingFormFourAdmin variant={variant} initialData={initialData}/>;
    }
    if (variant === "editing") {
        return <OnboardingFormFourEditing variant={variant} onNext={onNext} initialData={initialData}/>;
    }
    return (
        <OnboardingFormFourOnboarding
            variant={variant}
            onPrev={onPrev}
            onNext={onNext}
            initialData={initialData}
        />
    );
};

export default OnboardingFormFour;
