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
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
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

const AchievementsForm = ({
  onNext,
  onPrev,
  initialData,
  variant = "onboarding",
}: StepThreeProps) => {
  const { education_levels, annual_income_ranges } = PERSONAL_DROPDOWNS;

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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
    <div
      className={
        variant === "editing" || variant === "admin"
          ? "w-full"
          : "flex flex-col md:flex-row gap-10"
      }
    >
      {variant === "onboarding" ? (
        <div className="flex items-center justify-center w-full">
          <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-96 h-full relative">
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
            <Image
              src="/images/step-3-img.png"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white">
              “Choosing your mother tongue accurately helps our algorithm
              prioritize matches who share your conversational ease.”
            </p>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        {variant === "onboarding" || variant === "editing" ? (
          <div
            className={`grid grid-cols-1 gap-6 ${variant === "editing" ? "md:grid-cols-2" : ""
              }`}
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
              <Controller
                control={control}
                name="profession"
                render={({ field }) => (
                  <Combobox
                    items={GROUPS_PROFESSIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ComboboxInput placeholder="Select Profession" />
                    <ComboboxContent alignOffset={-28} className="w-60">
                      <ComboboxEmpty>No match found.</ComboboxEmpty>
                      <ComboboxList>
                        {(group) => (
                          <ComboboxGroup
                            key={group.category}
                            items={group.roles}
                          >
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
          </div>
        ) : (
          <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
              <Briefcase size={26} className="text-secondary" />
              <h4 className="text-black font-newsreader text-xl">
                Career & Profession
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1 col-span-2 space-y-1">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-muted"
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
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {/* {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )} */}
              </div>

              <div className="md:col-span-1 col-span-2 space-y-1">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-muted"
                >
                  Current Profession
                </Label>
                <Controller
                  control={control}
                  name="profession"
                  render={({ field }) => (
                    <Combobox
                      items={GROUPS_PROFESSIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <ComboboxInput placeholder="Select Profession" />

                      <ComboboxContent alignOffset={-28} className="w-60">
                        <ComboboxEmpty>No match found.</ComboboxEmpty>
                        <ComboboxList>
                          {(group) => (
                            <ComboboxGroup
                              key={group.category}
                              items={group.roles}
                            >
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
                {/* {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )} */}
              </div>

              <div className="md:col-span-1 col-span-2 space-y-1">
                <Label
                  htmlFor="residencyStatus"
                  className="text-sm font-medium text-muted"
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
                {/* {errors.residencyStatus && (
              <p className="text-sm text-red-600">
                {errors.residencyStatus.message}
              </p>
            )} */}
              </div>
            </div>
          </section>
        )}

        <div className="justify-end flex w-full col-span-2 mt-6">
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
    </div>
  );
};

export default AchievementsForm;
