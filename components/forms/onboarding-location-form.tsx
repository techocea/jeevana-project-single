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
import { Controller, useForm } from "react-hook-form";
import { StepFourInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepFourLocationSchema } from "@/lib/validation";

type StepFourValues = z.infer<typeof stepFourLocationSchema>;

interface StepFourProps {
  onPrev: () => void;
  onNext: (data: StepFourValues) => void;
  initialData: StepFourInitialData["initialData"];
}

const LocationInformation = ({
  onPrev,
  onNext,
  initialData,
}: StepFourProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepFourLocationSchema as any),
    defaultValues: {
      country: initialData?.country || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      residencyStatus: initialData?.residencyStatus || undefined,
    },
  });

  return (
    <div className="mt-16 w-full flex flex-col md:flex-row-reverse gap-10">
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
          <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white font-newsreader">
            "Success is most meaningful when shared with someone who understands
            your journey."
          </p>
        </div>
      </div>
      <div className="flex-1">
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-1 col-span-2 space-y-3">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Country
            </Label>
            <Input
              id="country"
              type="text"
              placeholder="Enter your country"
              {...register("country")}
            />
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-3">
            <Label
              htmlFor="state"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              State
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="Enter your state"
              {...register("state")}
            />
            {errors.state && (
              <p className="text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div className="col-span-2 space-y-3">
            <Label
              htmlFor="city"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              City
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Enter your city"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="col-span-2 space-y-3">
            <Label
              htmlFor="residencyStatus"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Residency Status
            </Label>
            <Controller
              control={control}
              name="residencyStatus"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your residency status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CITIZEN">Citizen</SelectItem>
                    <SelectItem value="PR">Permanent Resident</SelectItem>
                    <SelectItem value="WORK">Work Visa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.residencyStatus && (
              <p className="text-sm text-red-600">
                {errors.residencyStatus.message}
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

export default LocationInformation;
