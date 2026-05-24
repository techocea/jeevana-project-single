import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepOneInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepOneBasicSchema } from "@/lib/validation";
import Image from "next/image";

type StepOneValues = z.infer<typeof stepOneBasicSchema>;

interface StepOneProps {
  onNext: (data: StepOneValues) => void;
  initialData: StepOneInitialData["initialData"];
}

const BasicInformation = ({ onNext, initialData }: StepOneProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepOneBasicSchema as any),
    defaultValues: {
      fullName: initialData?.fullName || "",
      contact: initialData?.contact || "",
      gender: initialData?.gender || undefined,
      dob: initialData?.dob
        ? new Date(initialData?.dob).toISOString().split("T")[0]
        : undefined,
    },
  });

  return (
    <div className="mt-16 w-full flex flex-col md:flex-row gap-10">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="border border-secondary rounded-md bg-white/5 flex flex-col items-center justify-center min-w-100 w-full min-h-48 h-full relative">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-20 pointer-events-none"
            style={{ backgroundImage: `url(/images/step-3-img.png)` }}
          />
          <div className="z-20 flex flex-col items-center gap-4">
            <Image
              src="/images/demo-profile-pic.png"
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <form
          onSubmit={handleSubmit(onNext)}
          className="space-y-2 md:space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="md:col-span-1 col-span-2">
            <Label
              htmlFor="contact"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Contact Number
            </Label>
            <Input
              id="contact"
              type="text"
              placeholder="Enter your contact number"
              {...register("contact")}
            />
            {errors.contact && (
              <p className="text-sm text-red-600">{errors.contact.message}</p>
            )}
          </div>

          <div className="md:col-span-1 col-span-2">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Gender
            </Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <span className="text-sm text-red-600">
                {errors.gender.message}
              </span>
            )}
          </div>

          <div className="col-span-2">
            <Label
              htmlFor="dob"
              className="text-sm font-medium text-slate-700 uppercase mb-2"
            >
              Date of Birth
            </Label>
            <Input id="dob" type="date" {...register("dob")} />
            {errors.dob && (
              <span className="text-sm text-red-600">{errors.dob.message}</span>
            )}
          </div>

          {/* {serverError ? (
            <p className="text-sm text-red-600">{serverError}</p>
          ) : null} */}

          <div className="justify-end flex w-full col-span-2">
            <Button
              size="lg"
              type="submit"
              variant="secondary"
              className="w-fit uppercase rounded-xl py-3 px-5"
              disabled={isSubmitting}
            >
              Next Step <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicInformation;
