import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { StepTwoInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepTwoReligionSchema } from "@/lib/validation";
import { MOTHER_TONGUES, RELIGIONS_AND_CASTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

type StepTwoValues = z.infer<typeof stepTwoReligionSchema>;

interface StepTwoProps {
  onPrev?: () => void;
  onNext: (data: StepTwoValues) => void;
  initialData: StepTwoInitialData["initialData"];
  variant?: "onboarding" | "inline";
}

const ReligionInformation = ({
  onNext,
  onPrev,
  initialData,
  variant = "onboarding",
}: StepTwoProps) => {
  const isInline = variant === "inline";
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepTwoReligionSchema as any),
    defaultValues: {
      religion: initialData?.religion || "",
      caste: initialData?.caste || "",
      motherTongue: initialData?.motherTongue || undefined,
    },
  });

  const selectedReligion = watch("religion");
  const availableCastes = selectedReligion
    ? RELIGIONS_AND_CASTES[selectedReligion] || []
    : [];

  return (
    <div
      className={
        variant === "inline"
          ? "w-full"
          : "w-full flex flex-col md:flex-row gap-10"
      }
    >
      {variant === "onboarding" ? (
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
              “Choosing your mother tongue accurately helps our algorithm
              prioritize matches who share your conversational ease.”
            </p>
          </div>
        </div>
      ) : null}
      <div className={isInline ? "w-full" : "flex-1"}>
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-2 flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label
              htmlFor="religion"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Religion
            </Label>
            <Controller
              control={control}
              name="religion"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("caste", "");
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(RELIGIONS_AND_CASTES).map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.religion && (
              <p className="text-sm text-red-600">{errors.religion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="caste"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Caste
            </Label>
            <Controller
              control={control}
              name="caste"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={!selectedReligion}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      !selectedReligion &&
                      "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        selectedReligion
                          ? "Select Caste"
                          : "Choose a religion first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCastes.map((caste) => (
                      <SelectItem key={caste} value={caste}>
                        {caste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.caste && (
              <p className="text-sm text-red-600">{errors.caste.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="motherTongue"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Mother Tongue
            </Label>
            <Controller
              control={control}
              name="motherTongue"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Mother Tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTHER_TONGUES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.motherTongue && (
              <p className="text-sm text-red-600">
                {errors.motherTongue.message}
              </p>
            )}
          </div>

          {variant === "onboarding" ? (
            <div className="justify-between flex w-full mt-4">
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
                disabled={isSubmitting}
              >
                Next Step <ArrowRight />
              </Button>
            </div>
          ) : (
            <div className="justify-end flex w-full col-span-2 mt-4">
              <Button
                size="lg"
                type="submit"
                variant="default"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReligionInformation;
