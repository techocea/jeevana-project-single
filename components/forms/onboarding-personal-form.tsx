import { z } from "zod";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import Image from "next/image";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { StepFiveInitialData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingFormValues, stepFivePersonalSchema } from "@/lib/validation";
import {
  generateHeightOptions,
  generateWeightOptions,
} from "@/helpers/measurement-utils";

type StepFiveValues = z.infer<typeof stepFivePersonalSchema>;

interface StepFiveProps {
  onPrev: () => void;
  onNext: (data: StepFiveValues) => void;
  initialData: StepFiveInitialData["initialData"];
}

const PersonalInformation = ({
  onPrev,
  onNext,
  initialData,
}: StepFiveProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepFivePersonalSchema as any),
    defaultValues: {
      height: initialData?.height || "",
      weight: initialData?.weight || "",
      smoking: initialData?.smoking || undefined,
      drinking: initialData?.drinking || undefined,
      foodPreferences: initialData?.foodPreferences || undefined,
      isDifferentlyAbled: initialData?.isDifferentlyAbled || undefined,
      differentlyAbledDetails:
        initialData?.differentlyAbledDetails || undefined,
      narrative: initialData?.narrative || undefined,
    },
  });

  const heightDataObjects = useMemo(() => generateHeightOptions(), []);
  const weightDataObjects = useMemo(() => generateWeightOptions(), []);

  const heightValuesList = heightDataObjects.map((h) => h.value);
  const weightValuesList = weightDataObjects.map((w) => w.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-16   items-start gap-10">
      <div className="lg:col-span-1 flex items-center justify-center w-full">
        <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-64 h-full relative">
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
          <Image
            src="/images/step-3-img.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white font-newsreader">
            "Success is most meaningful when shared with someone who understands
            your journey."
          </p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-3">
            <Label
              htmlFor="height"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Height
            </Label>
            <Controller
              control={control}
              name="height"
              render={({ field }) => (
                <Combobox
                  items={heightValuesList}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput
                    placeholder="Select Height"
                    // Intercept presentation display text so it renders "5' 11\"" instead of "71"
                    value={
                      heightDataObjects.find((h) => h.value === field.value)
                        ?.label || ""
                    }
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => {
                        const displayLabel =
                          heightDataObjects.find((h) => h.value === item)
                            ?.label || item;
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
            {errors.height && (
              <p className="text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="weight"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Weight
            </Label>
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <Combobox
                  items={weightValuesList}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput
                    placeholder="Select Weight"
                    // Intercept presentation display text so it renders "165 lbs" instead of "165"
                    value={
                      weightDataObjects.find((w) => w.value === field.value)
                        ?.label || ""
                    }
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => {
                        const displayLabel =
                          weightDataObjects.find((w) => w.value === item)
                            ?.label || item;
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
            {errors.weight && (
              <p className="text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          {/* 2. Habits (Smoking & Drinking) */}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Smoking Habits
            </Label>
            <Controller
              control={control}
              name="smoking"
              defaultValue="never"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value ?? "never"}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="s1" />
                    <Label
                      htmlFor="s1"
                      className="font-normal text-accent-foreground"
                    >
                      Never
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasionally" id="s2" />
                    <Label
                      htmlFor="s2"
                      className="font-normal text-accent-foreground"
                    >
                      Occasionally
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="s3" />
                    <Label
                      htmlFor="s3"
                      className="font-normal text-accent-foreground"
                    >
                      Regularly
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.smoking && (
              <p className="text-sm text-red-600">{errors.smoking.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Drinking Habits
            </Label>
            <Controller
              control={control}
              name="drinking"
              defaultValue="never"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? "never"}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="d1" />
                    <Label
                      htmlFor="d1"
                      className="font-normal text-accent-foreground"
                    >
                      Non-drinker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="socially" id="d2" />
                    <Label
                      htmlFor="d2"
                      className="font-normal text-accent-foreground"
                    >
                      Socially
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="d3" />
                    <Label
                      htmlFor="d3"
                      className="font-normal text-accent-foreground"
                    >
                      Regularly
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.drinking && (
              <p className="text-sm text-red-600">{errors.drinking.message}</p>
            )}
          </div>

          {/* 3. Food Preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Food Preferences
            </Label>
            <Controller
              control={control}
              name="foodPreferences"
              defaultValue="vegetarian"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? "vegetarian"}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="f1" />
                    <Label
                      htmlFor="f1"
                      className="font-normal text-accent-foreground"
                    >
                      Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-vegetarian" id="f2" />
                    <Label
                      htmlFor="f2"
                      className="font-normal text-accent-foreground"
                    >
                      Non-Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="f3" />
                    <Label
                      htmlFor="f3"
                      className="font-normal text-accent-foreground"
                    >
                      Vegan
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.foodPreferences && (
              <p className="text-sm text-red-600">
                {errors.foodPreferences.message}
              </p>
            )}
          </div>

          {/* 4. Differently Abled */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Differently Abled?
            </Label>
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
                    <Label
                      htmlFor="differently-abled-yes"
                      className="font-normal text-accent-foreground"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="differently-abled-no" />
                    <Label
                      htmlFor="differently-abled-no"
                      className="font-normal text-accent-foreground"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {/* Conditional Input field if 'Yes' is picked */}
            {watch("isDifferentlyAbled") === true && (
              <div className="pt-2 animate-in fade-in duration-200">
                <Input placeholder="Please specify any assistance or details needed" />
              </div>
            )}

            {errors.isDifferentlyAbled && (
              <p className="text-sm text-red-600">
                {errors.isDifferentlyAbled.message}
              </p>
            )}
          </div>

          {/* {serverError ? (
            <p className="text-sm text-red-600">{serverError}</p>
          ) : null} */}

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
              Next Step
              <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
