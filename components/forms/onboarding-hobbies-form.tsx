import z from "zod";
import { useForm, useFormContext, useFormState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Drum } from "lucide-react";
import { PERSONAL_DROPDOWNS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepSixHobbiesSchema } from "@/lib/validation";

type StepSixValues = z.infer<typeof stepSixHobbiesSchema>;

interface StepSixProps {
  onPrev?: () => void;
  onNext?: (data: StepSixValues) => void;
  initialData: Record<string, any>;
  variant?: "onboarding" | "editing" | "admin";
}

/* ------------------------------------------------------------------ */
/* Shared fieldset — the hobby toggle grid + error message.             */
/* ------------------------------------------------------------------ */
function HobbiesFieldset({
                           currentSelectedHobbies,
                           toggleHobbySelection,
                           errors,
                         }: {
  currentSelectedHobbies: string[];
  toggleHobbySelection: (hobbyLabel: string) => void;
  errors: Record<string, any>;
}) {
  const { hobbies } = PERSONAL_DROPDOWNS;

  return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hobbies.map((hobby) => {
            const isSelected = currentSelectedHobbies.includes(hobby.label);
            return (
                <Button
                    type="button"
                    key={hobby.label}
                    onClick={() => toggleHobbySelection(hobby.label)}
                    variant={isSelected ? "default" : "outline"}
                    className="flex flex-col items-center gap-4 h-full py-4"
                >
              <span className="text-3xl leading-none" role="img" aria-label={hobby.label}>
                {hobby.icon}
              </span>
                  <span className="text-sm font-medium tracking-tight text-secondary">
                {hobby.label}
              </span>
                </Button>
            );
          })}
        </div>

        {errors.hobbies && (
            <p className="text-sm font-medium text-destructive mt-2 animate-pulse">
              {errors.hobbies.message as string}
            </p>
        )}
      </div>
  );
}

function useHobbyToggle(
    watch: ReturnType<typeof useForm<OnboardingFormValues>>["watch"],
    setValue: ReturnType<typeof useForm<OnboardingFormValues>>["setValue"],
) {
  const currentSelectedHobbies = watch("hobbies") || [];

  const toggleHobbySelection = (hobbyLabel: string) => {
    const isAlreadySelected = currentSelectedHobbies.includes(hobbyLabel);
    const updatedHobbiesArray = isAlreadySelected
        ? currentSelectedHobbies.filter((item: string) => item !== hobbyLabel)
        : [...currentSelectedHobbies, hobbyLabel];

    setValue("hobbies", updatedHobbiesArray, { shouldValidate: true, shouldDirty: true });
  };

  return { currentSelectedHobbies, toggleHobbySelection };
}

/* ------------------------------------------------------------------ */
/* ONBOARDING                                                           */
/* ------------------------------------------------------------------ */
function HobbiesSelectorOnboarding({ onPrev, onNext, initialData }: StepSixProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepSixHobbiesSchema as any),
    defaultValues: {
      hobbies: initialData?.hobbies || [],
    },
  });

  const { currentSelectedHobbies, toggleHobbySelection } = useHobbyToggle(watch, setValue);

  return (
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="space-y-8">
        <HobbiesFieldset
            currentSelectedHobbies={currentSelectedHobbies}
            toggleHobbySelection={toggleHobbySelection}
            errors={errors}
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
      </form>
  );
}

/* ------------------------------------------------------------------ */
/* EDITING                                                              */
/* ------------------------------------------------------------------ */
function HobbiesSelectorEditing({ onNext, initialData }: StepSixProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepSixHobbiesSchema as any),
    defaultValues: {
      hobbies: initialData?.hobbies || [],
    },
  });

  const { currentSelectedHobbies, toggleHobbySelection } = useHobbyToggle(watch, setValue);

  return (
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="space-y-8">
        <HobbiesFieldset
            currentSelectedHobbies={currentSelectedHobbies}
            toggleHobbySelection={toggleHobbySelection}
            errors={errors}
        />
        <div className="justify-end flex w-full mt-4">
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
function HobbiesSelectorAdmin(_props: StepSixProps) {
  const { setValue, watch, control } = useFormContext<OnboardingFormValues>();
  const { errors } = useFormState({ control });
  const { currentSelectedHobbies, toggleHobbySelection } = useHobbyToggle(watch, setValue);

  return (
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <Drum size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Hobbies</h4>
        </div>
        <HobbiesFieldset
            currentSelectedHobbies={currentSelectedHobbies}
            toggleHobbySelection={toggleHobbySelection}
            errors={errors}
        />
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Wrapper                                                              */
/* ------------------------------------------------------------------ */
const HobbiesSelector = ({ onNext, onPrev, initialData, variant = "onboarding" }: StepSixProps) => {
  if (variant === "admin") {
    return <HobbiesSelectorAdmin variant={variant} initialData={initialData} />;
  }
  if (variant === "editing") {
    return <HobbiesSelectorEditing variant={variant} onNext={onNext} initialData={initialData} />;
  }
  return (
      <HobbiesSelectorOnboarding variant={variant} onPrev={onPrev} onNext={onNext} initialData={initialData} />
  );
};

export default HobbiesSelector;