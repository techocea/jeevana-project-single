import { z } from "zod";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useMemo } from "react";
import { Controller, useForm, useFormContext, useFormState } from "react-hook-form";
import { StepFiveInitialData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {  ArrowRight, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingFormValues, stepFivePersonalSchema } from "@/lib/validation";
import {
  generateHeightOptions,
  generateWeightOptions,
} from "@/helpers/measurement-utils";
import Image from "next/image";
import {Textarea} from "@/components/ui/textarea";

type StepFiveValues = z.infer<typeof stepFivePersonalSchema>;

interface StepFiveProps {
  onPrev?: () => void;
  onNext?: (data: StepFiveValues) => void;
  initialData: StepFiveInitialData["initialData"];
  variant?: "onboarding" | "editing" | "admin";
}


function PersonalInformationFieldset({
                                       register,
                                       control,
                                       watch,
                                       errors,
                                       heightDataObjects,
                                       weightDataObjects,
                                       heightValuesList,
                                       weightValuesList,
                                     }: {
  register: ReturnType<typeof useForm<OnboardingFormValues>>["register"];
  control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
  watch: ReturnType<typeof useForm<OnboardingFormValues>>["watch"];
  errors: Record<string, any>;
  heightDataObjects: { value: string; label: string }[];
  weightDataObjects: { value: string; label: string }[];
  heightValuesList: string[];
  weightValuesList: string[];
}) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="height" className="text-sm font-medium text-slate-700 uppercase">
            Height
          </Label>
          <Controller
              control={control}
              name="height"
              render={({ field }) => (
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
          <Label htmlFor="weight" className="text-sm font-medium text-slate-700 uppercase">
            Weight
          </Label>
          <Controller
              control={control}
              name="weight"
              render={({ field }) => (
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

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 uppercase">Smoking Habits</Label>
          <Controller
              control={control}
              name="smoking"
              defaultValue="never"
              render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value ?? "never"} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="s1" />
                      <Label htmlFor="s1" className="font-normal text-accent-foreground">Never</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasionally" id="s2" />
                      <Label htmlFor="s2" className="font-normal text-accent-foreground">Occasionally</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regularly" id="s3" />
                      <Label htmlFor="s3" className="font-normal text-accent-foreground">Regularly</Label>
                    </div>
                  </RadioGroup>
              )}
          />
          {errors.smoking && <p className="text-sm text-red-600">{errors.smoking.message as string}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 uppercase">Drinking Habits</Label>
          <Controller
              control={control}
              name="drinking"
              defaultValue="never"
              render={({ field }) => (
                  <RadioGroup value={field.value ?? "never"} onValueChange={field.onChange} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="d1" />
                      <Label htmlFor="d1" className="font-normal text-accent-foreground">Non-drinker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasionally" id="d2" />
                      <Label htmlFor="d2" className="font-normal text-accent-foreground">Occasionally</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regularly" id="d3" />
                      <Label htmlFor="d3" className="font-normal text-accent-foreground">Regularly</Label>
                    </div>
                  </RadioGroup>
              )}
          />
          {errors.drinking && <p className="text-sm text-red-600">{errors.drinking.message as string}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 uppercase">Food Preferences</Label>
          <Controller
              control={control}
              name="foodPreferences"
              defaultValue="vegetarian"
              render={({ field }) => (
                  <RadioGroup value={field.value ?? "vegetarian"} onValueChange={field.onChange} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="f1" />
                      <Label htmlFor="f1" className="font-normal text-accent-foreground">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-vegetarian" id="f2" />
                      <Label htmlFor="f2" className="font-normal text-accent-foreground">Non-Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="f3" />
                      <Label htmlFor="f3" className="font-normal text-accent-foreground">Vegan</Label>
                    </div>
                  </RadioGroup>
              )}
          />
          {errors.foodPreferences && (
              <p className="text-sm text-red-600">{errors.foodPreferences.message as string}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 uppercase">Differently Abled?</Label>
          <Controller
              control={control}
              name="isDifferentlyAbled"
              render={({ field }) => (
                  <RadioGroup
                      value={field.value === true ? "yes" : "no"}
                      onValueChange={(val) => field.onChange(val === "yes")}
                      className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="differently-abled-yes" />
                      <Label htmlFor="differently-abled-yes" className="font-normal text-accent-foreground">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="differently-abled-no" />
                      <Label htmlFor="differently-abled-no" className="font-normal text-accent-foreground">No</Label>
                    </div>
                  </RadioGroup>
              )}
          />
          {watch("isDifferentlyAbled") === true && (
              <div className="pt-2 animate-in fade-in duration-200">
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

        {/* FIX: narrative was in every variant's defaultValues but had no field
          anywhere in the original component. */}
        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="narrative" className="text-sm font-medium text-slate-700 uppercase">
            About / Bio
          </Label>
          <Textarea
              id="narrative"
              placeholder="A few lines describing yourself..."
              rows={4}
              {...register("narrative")}
          />
          {errors.narrative && <p className="text-sm text-red-600">{errors.narrative.message as string}</p>}
        </div>
      </div>
  );
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

/* ------------------------------------------------------------------ */
/* ONBOARDING                                                           */
/* ------------------------------------------------------------------ */
function PersonalInformationOnboarding({ onPrev, onNext, initialData }: StepFiveProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepFivePersonalSchema as any),
    defaultValues: {
      height: initialData?.height ? String(initialData.height) : "",
      weight: initialData?.weight ? String(initialData.weight) : "",
      smoking: initialData?.smoking || "never",
      drinking: initialData?.drinking || "never",
      foodPreferences: initialData?.foodPreferences || undefined,
      isDifferentlyAbled: initialData?.isDifferentlyAbled || undefined,
      differentlyAbledDetails: initialData?.differentlyAbledDetails || undefined,
      narrative: initialData?.narrative || undefined,
    },
  });

  const heightWeight = useHeightWeightOptions();

  return (
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full flex flex-col md:flex-row gap-10">
        <div className="flex items-center justify-center w-full">
          <div className="overflow-hidden rounded-md flex flex-col items-center justify-center w-full h-102 relative">
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
            <Image src="/images/step-3-img.png" alt="" fill priority className="object-cover" />
            <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white font-newsreader">
              "Success is most meaningful when shared with someone who understands your journey."
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          <PersonalInformationFieldset
              register={register}
              control={control}
              watch={watch}
              errors={errors}
              {...heightWeight}
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
              Next Step <ArrowRight />
            </Button>
          </div>
        </div>
      </form>
  );
}

/* ------------------------------------------------------------------ */
/* EDITING                                                              */
/* ------------------------------------------------------------------ */
function PersonalInformationEditing({ onNext, initialData }: StepFiveProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepFivePersonalSchema as any),
    defaultValues: {
      height: initialData?.height ? String(initialData.height) : "",
      weight: initialData?.weight ? String(initialData.weight) : "",
      smoking: initialData?.smoking || "never",
      drinking: initialData?.drinking || "never",
      foodPreferences: initialData?.foodPreferences || undefined,
      isDifferentlyAbled: initialData?.isDifferentlyAbled || undefined,
      differentlyAbledDetails: initialData?.differentlyAbledDetails || undefined,
      narrative: initialData?.narrative || undefined,
    },
  });

  const heightWeight = useHeightWeightOptions();

  return (
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
        <PersonalInformationFieldset
            register={register}
            control={control}
            watch={watch}
            errors={errors}
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

/* ------------------------------------------------------------------ */
/* ADMIN — no <form>, no buttons, reads/writes shared context.          */
/* ------------------------------------------------------------------ */
function PersonalInformationAdmin(_props: StepFiveProps) {
  const { register, control, watch } = useFormContext<OnboardingFormValues>();
  const { errors } = useFormState({ control });
  const heightWeight = useHeightWeightOptions();

  return (
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <Info size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Additional Details</h4>
        </div>
        <PersonalInformationFieldset
            register={register}
            control={control}
            watch={watch}
            errors={errors}
            {...heightWeight}
        />
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Wrapper                                                              */
/* ------------------------------------------------------------------ */
const PersonalInformation = ({ onNext, onPrev, initialData, variant = "onboarding" }: StepFiveProps) => {
  if (variant === "admin") {
    return <PersonalInformationAdmin variant={variant} initialData={initialData} />;
  }
  if (variant === "editing") {
    return <PersonalInformationEditing variant={variant} onNext={onNext} initialData={initialData} />;
  }
  return (
      <PersonalInformationOnboarding variant={variant} onPrev={onPrev} onNext={onNext} initialData={initialData} />
  );
};

export default PersonalInformation;