import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepThreeInitialData } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingFormValues,
  stepThreeAchievementsSchema,
} from "@/lib/validation";
import { PERSONAL_DROPDOWNS } from "@/lib/constants";

type StepThreeValues = z.infer<typeof stepThreeAchievementsSchema>;

interface StepThreeProps {
  onPrev: () => void;
  onNext: (data: StepThreeValues) => void;
  initialData: StepThreeInitialData["initialData"];
}

const AchievementsForm = ({ onPrev, onNext, initialData }: StepThreeProps) => {
  const { education_levels, annual_income_ranges } = PERSONAL_DROPDOWNS;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepThreeAchievementsSchema as any),
    defaultValues: {
      educationLevel: initialData?.educationLevel || "",
      profession: initialData?.profession || "",
      annualIncomeRange: initialData?.annualIncomeRange || undefined,
    },
  });

  return (
    <div className="mt-16 w-full flex flex-col md:flex-row gap-10">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-64 h-full relative">
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
          <Image
            src="/images/step-3-img.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white">
            "Success is most meaningful when shared with someone who understands
            your journey."
          </p>
        </div>
      </div>
      <div className="flex-1">
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-2 flex flex-col gap-4"
        >
          <div className="space-y-3">
            <Label
              htmlFor="educationLevel"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Highest Education Level
            </Label>
            <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
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
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.educationLevel && (
              <p className="text-sm text-red-600">
                {errors.educationLevel.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="profession"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Current Profession
            </Label>
            <Input
              id="profession"
              type="text"
              placeholder="Enter your profession"
              {...register("profession")}
            />
            {errors.profession && (
              <p className="text-sm text-red-600">
                {errors.profession.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="annualIncomeRange"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Annual Income Range
            </Label>
            <Controller
              control={control}
              name="annualIncomeRange"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
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
          </div>

          {/* <div className="bg-primary/20 border-l-2 border-secondary justify-between flex w-full h-full p-4 rounded-md">
            <p className="text-sm italic text-secondary">
              "Success is most meaningful when shared with someone who
              understands your journey."
            </p>
          </div> */}
          {/* {serverError ? (
            <p className="text-sm text-red-600">{serverError}</p>
          ) : null} */}

          <div className="justify-between flex w-full">
            <Button
              size="lg"
              onClick={onPrev}
              variant="link"
            className="w-fit uppercase rounded-xl py-3 pr-5 -ml-3"
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
              Next Step <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementsForm;
