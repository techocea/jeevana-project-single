import { z } from "zod";
import { StepTwoInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepTwoReligionSchema } from "@/lib/validation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

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
    formState: { errors, isSubmitting },
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
        <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-[450px] h-full relative">
          <Image
            src="/images/step-3-img.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-2 flex flex-col gap-4"
        >
          <div>
            <Label
              htmlFor="religion"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Religion
            </Label>
            <Input
              id="religion"
              type="text"
              placeholder="Enter your religion"
              {...register("religion")}
            />
            {errors.religion && (
              <p className="text-sm text-red-600">{errors.religion.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="caste"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Caste
            </Label>
            <Input
              id="caste"
              type="text"
              placeholder="Enter your caste"
              {...register("caste")}
            />
            {errors.caste && (
              <p className="text-sm text-red-600">{errors.caste.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="motherTongue"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Mother Tongue
            </Label>
            <Input
              id="motherTongue"
              type="text"
              placeholder="Enter your mother tongue"
              {...register("motherTongue")}
            />
            {errors.motherTongue && (
              <p className="text-sm text-red-600">
                {errors.motherTongue.message}
              </p>
            )}
          </div>

          <div className="bg-primary/20 border-l-2 border-secondary justify-between flex w-full h-full p-4 rounded-md">
            <p className="text-sm italic text-secondary">
              “Choosing your mother tongue accurately helps our algorithm
              prioritize matches who share your conversational ease."
            </p>
          </div>
          {/* {serverError ? (
            <p className="text-sm text-red-600">{serverError}</p>
          ) : null} */}

          <div className="justify-between flex w-full">
            <Button
              size="lg"
              onClick={onPrev}
              variant="link"
              className="w-fit uppercase rounded-xl py-3 px-5"
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
