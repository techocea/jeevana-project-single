import z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PERSONAL_DROPDOWNS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepSixHobbiesSchema } from "@/lib/validation";

type StepSixValues = z.infer<typeof stepSixHobbiesSchema>;

interface StepSixProps {
  initialData: Record<string, any>;
  onPrev: () => void;
  onNext: (data: StepSixValues) => void;
}

const HobbiesSelector = ({ initialData, onPrev, onNext }: StepSixProps) => {
  const { hobbies } = PERSONAL_DROPDOWNS;

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepSixHobbiesSchema as any),
    defaultValues: {
      hobbies: initialData.hobbies || [],
    },
  });

  const currentSelectedHobbies = watch("hobbies");

  const toggleHobbySelection = (hobbyLabel: string) => {
    const isAlreadySelected = currentSelectedHobbies.includes(hobbyLabel);
    const updatedHobbiesArray = isAlreadySelected
      ? currentSelectedHobbies.filter((item) => item !== hobbyLabel)
      : [...currentSelectedHobbies, hobbyLabel];

    setValue("hobbies", updatedHobbiesArray, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <div className="space-y-3 my-16">
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
                <span
                  className="text-3xl leading-none"
                  role="img"
                  aria-label={hobby.label}
                >
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
            {errors.hobbies.message}
          </p>
        )}
      </div>

      {/* Button Row Action Strip Bar */}
      <div className="justify-between flex w-full col-span-2">
        <Button
          size="lg"
          onClick={onPrev}
          variant="link"
          className="w-fit uppercase rounded-xl py-3 pr-5 -ml-4"
        >
          <ArrowLeft />
          Back
        </Button>
        <Button
          size="lg"
          type="submit"
          variant="secondary"
          className="w-fit uppercase rounded-xl py-3 px-5"
        >
          Publish Ad
          <ArrowRight />
        </Button>
      </div>
    </form>
  );
};

export default HobbiesSelector;
