import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxLabel,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxCollection,
} from "@/components/ui/combobox";
import { useForm, Controller,useFormContext, useFormState } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingFormValues,
  stepThreeAchievementsSchema,
} from "@/lib/validation";
import { GROUPS_PROFESSIONS, PERSONAL_DROPDOWNS } from "@/lib/constants";
import Image from "next/image";
import { StepThreeInitialData } from "@/types";

type StepThreeValues = z.infer<typeof stepThreeAchievementsSchema>;

interface StepThreeProps {
  onPrev?: () => void;
  onNext?: (data: StepThreeValues) => void;
  initialData: StepThreeInitialData["initialData"];
  variant?: "onboarding" | "editing" | "admin";
}

function AchievementsFieldset({
                                control,
                                errors,
                                columns,
                              }: {
  control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
  errors: Record<string, any>;
  columns: 1 | 2;
}) {
  const { education_levels, annual_income_ranges } = PERSONAL_DROPDOWNS;

  return (
      <div className={`grid grid-cols-1 gap-6 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        <div className="space-y-3">
          <Label htmlFor="educationLevel" className="text-sm font-medium text-slate-700 uppercase">
            Highest Education Level
          </Label>
          <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {education_levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              )}
          />
          {errors.educationLevel && (
              <p className="text-sm text-red-600">{errors.educationLevel.message as string}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="profession" className="text-sm font-medium text-slate-700 uppercase">
            Current Profession
          </Label>
          <Controller
              control={control}
              name="profession"
              render={({ field }) => (
                  <Combobox items={GROUPS_PROFESSIONS} value={field.value} onValueChange={field.onChange}>
                    <ComboboxInput placeholder="Select Profession" />
                    <ComboboxContent alignOffset={-28} className="w-60">
                      <ComboboxEmpty>No match found.</ComboboxEmpty>
                      <ComboboxList>
                        {(group) => (
                            <ComboboxGroup key={group.category} items={group.roles}>
                              <ComboboxLabel className="uppercase font-bold text-black">
                                {group.category}
                              </ComboboxLabel>
                              <ComboboxCollection>
                                {(item) => (
                                    <ComboboxItem key={item} value={item}>
                                      {item}
                                    </ComboboxItem>
                                )}
                              </ComboboxCollection>
                            </ComboboxGroup>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
              )}
          />
          {errors.profession && (
              <p className="text-sm text-red-600">{errors.profession.message as string}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="annualIncomeRange" className="text-sm font-medium text-slate-700 uppercase">
            Annual Income Range
          </Label>
          <Controller
              control={control}
              name="annualIncomeRange"
              render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select annual income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {annual_income_ranges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              )}
          />
          {errors.annualIncomeRange && (
              <p className="text-sm text-red-600">{errors.annualIncomeRange.message as string}</p>
          )}
        </div>
      </div>
  );
}


function AchievementsFormOnboarding({ onPrev, onNext, initialData }: StepThreeProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepThreeAchievementsSchema as any),
        defaultValues: {
            educationLevel: initialData?.educationLevel || "",
            profession: initialData?.profession || "",
            annualIncomeRange: initialData?.annualIncomeRange || undefined,
        },
    });

    return (
        <form
            onSubmit={handleSubmit((data) => onNext?.(data))}
            className="w-full flex flex-col md:flex-row gap-10"
        >
            <div className="flex items-center justify-center w-full">
                <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-96 h-full relative">
                    <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
                    <Image src="/images/step-3-img.png" alt="" fill priority className="object-cover" />
                    <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white">
                        "Choosing your mother tongue accurately helps our algorithm prioritize matches who
                        share your conversational ease."
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-6">
                <AchievementsFieldset control={control} errors={errors} columns={1} />

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
function AchievementsFormEditing({ onNext, initialData }: StepThreeProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(stepThreeAchievementsSchema as any),
        defaultValues: {
            educationLevel: initialData?.educationLevel || "",
            profession: initialData?.profession || "",
            annualIncomeRange: initialData?.annualIncomeRange || undefined,
        },
    });

    return (
        <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
            <AchievementsFieldset control={control} errors={errors} columns={2} />
            <div className="justify-end flex w-full mt-6">
                <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}


function AchievementsFormAdmin(_props: StepThreeProps) {
    const { control } = useFormContext<OnboardingFormValues>();
    const { errors } = useFormState({ control });

    return (
        <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Briefcase size={26} className="text-secondary" />
                <h4 className="text-black font-newsreader text-xl">Career & Profession</h4>
            </div>
            <AchievementsFieldset control={control} errors={errors} columns={2} />
        </section>
    );
}

const AchievementsForm = ({ onNext, onPrev, initialData, variant = "onboarding" }: StepThreeProps) => {
    if (variant === "admin") {
        return <AchievementsFormAdmin variant={variant} initialData={initialData} />;
    }
    if (variant === "editing") {
        return <AchievementsFormEditing variant={variant} onNext={onNext} initialData={initialData} />;
    }
    return (
        <AchievementsFormOnboarding variant={variant} onPrev={onPrev} onNext={onNext} initialData={initialData} />
    );
};

export default AchievementsForm;
