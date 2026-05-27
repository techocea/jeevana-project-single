import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { StepTwoInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepTwoReligionSchema } from "@/lib/validation";

type StepTwoValues = z.infer<typeof stepTwoReligionSchema>;

interface StepTwoProps {
  onPrev: () => void;
  onNext: (data: StepTwoValues) => void;
  initialData: StepTwoInitialData["initialData"];
}

const ReligionInformation = ({ onPrev, onNext, initialData }: StepTwoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepTwoReligionSchema as any),
    defaultValues: {
      religion: initialData?.religion || "",
      caste: initialData?.caste || "",
      motherTongue: initialData?.motherTongue || undefined,
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
            “Choosing your mother tongue accurately helps our algorithm
            prioritize matches who share your conversational ease."
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
              htmlFor="religion"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Religion
            </Label>
            <Input
              id="religion"
              type="text"
              placeholder="Enter religion"
              {...register("religion")}
            />
            {errors.religion && (
              <p className="text-sm text-red-600">{errors.religion.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="caste"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Caste
            </Label>
            <Input
              id="caste"
              type="text"
              placeholder="Enter caste"
              {...register("caste")}
            />
            {errors.caste && (
              <p className="text-sm text-red-600">{errors.caste.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="motherTongue"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Mother Tongue
            </Label>
            <Input
              id="motherTongue"
              type="text"
              placeholder="Enter mother tongue"
              {...register("motherTongue")}
            />
            {errors.motherTongue && (
              <p className="text-sm text-red-600">
                {errors.motherTongue.message}
              </p>
            )}
          </div>

        
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

export default ReligionInformation;
