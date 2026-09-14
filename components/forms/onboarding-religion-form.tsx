import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useForm, Controller, useFormContext, useFormState} from "react-hook-form";
import { StepTwoInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepTwoReligionSchema } from "@/lib/validation";
import { MOTHER_TONGUES, RELIGIONS_AND_CASTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MdTempleBuddhist } from "react-icons/md";

type StepTwoValues = z.infer<typeof stepTwoReligionSchema>;

interface StepTwoProps {
  onPrev?: () => void;
  onNext?: (data: StepTwoValues) => void;
  initialData: StepTwoInitialData["initialData"];
  variant?: "onboarding" | "editing" | "admin";
}

function ReligionInformationFields({
  selectedReligion,
  availableCastes,
  onReligionChange,
  columns,
 control,
 errors,
}: {
  control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
  errors: Record<string, any>;
  selectedReligion: string | null | undefined;
  availableCastes: string[];
  onReligionChange: (value: string) => void;
  columns: 1 | 2;
}) {
  return (
      <div
          className={cn(
              "grid grid-cols-1 gap-6",
              columns === 2 && "md:grid-cols-2 gap-4",
          )}
      >
        <div className="space-y-2">
          <Label htmlFor="religion" className="text-sm font-medium text-slate-700 uppercase">
            Religion
          </Label>
          <Controller
              control={control}
              name="religion"
              render={({ field }) => (
                  <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        onReligionChange(val);
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
              <p className="text-sm text-red-600">{errors.religion.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="caste" className="text-sm font-medium text-slate-700 uppercase">
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
                          placeholder={selectedReligion ? "Select Caste" : "Choose a religion first"}
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
              <p className="text-sm text-red-600">{errors.caste.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherTongue" className="text-sm font-medium text-slate-700 uppercase">
            Mother Tongue
          </Label>
          <Controller
              control={control}
              name="motherTongue"
              render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
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
              <p className="text-sm text-red-600">{errors.motherTongue.message as string}</p>
          )}
        </div>
      </div>
  );
}

function ReligionInformationOnboarding({ onPrev, onNext, initialData }: StepTwoProps) {
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
          <ReligionInformationFields
              control={control}
              errors={errors}
              selectedReligion={selectedReligion}
              availableCastes={availableCastes}
              onReligionChange={() => setValue("caste", "")}
              columns={1}
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

function ReligionInformationEditing({ onNext, initialData }: StepTwoProps) {
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
        <ReligionInformationFields
            control={control}
            errors={errors}
            selectedReligion={selectedReligion}
            availableCastes={availableCastes}
            onReligionChange={() => setValue("caste", "")}
            columns={1}
        />

        <div className="justify-end flex w-full mt-6">
          <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
  );
}

function ReligionInformationAdmin(_props: StepTwoProps) {
  const { watch, control, setValue } = useFormContext<OnboardingFormValues>();
  const { errors } = useFormState({ control });

  const selectedReligion = watch("religion");
  const availableCastes = selectedReligion
      ? RELIGIONS_AND_CASTES[selectedReligion] || []
      : [];

  return (
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <MdTempleBuddhist size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Religion</h4>
        </div>

        <ReligionInformationFields
            control={control}
            errors={errors}
            selectedReligion={selectedReligion}
            availableCastes={availableCastes}
            onReligionChange={() => setValue("caste", "")}
            columns={2}
        />
      </section>
  );
}

const ReligionInformation = ({
                               onNext,
                               onPrev,
                               initialData,
                               variant = "onboarding",
                             }: StepTwoProps) => {
  if (variant === "admin") {
    return <ReligionInformationAdmin variant={variant} initialData={initialData} />;
  }
  if (variant === "editing") {
    return (
        <ReligionInformationEditing variant={variant} onNext={onNext} initialData={initialData} />
    );
  }
  return (
      <ReligionInformationOnboarding
          variant={variant}
          onPrev={onPrev}
          onNext={onNext}
          initialData={initialData}
      />
  );
};

export default ReligionInformation;
