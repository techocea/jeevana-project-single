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
import { ArrowRight, User } from "lucide-react";
import {useForm, Controller, useFormContext, useFormState} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploadZone from "@/components/landing/image-upload";
import { OnboardingFormValues, stepOneBasicSchema } from "@/lib/validation";
import { formatDate } from "@/helpers/format-date";

type StepOneValues = z.infer<typeof stepOneBasicSchema>;

export const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

interface StepOneProps {
  onPrev?: () => void;
  onNext?: (data: StepOneValues) => void;
  initialData: StepOneInitialData["initialData"];
  variant: "onboarding" | "editing" | "admin";
}

function BasicInformationFields({
    register,
    control,
    errors,
    showCreatedBy
}: {
  register: ReturnType<typeof useForm<OnboardingFormValues>>["register"];
  control: ReturnType<typeof useForm<OnboardingFormValues>>["control"];
  errors: Record<string, any>;
  showCreatedBy: boolean;
}) {
  return(
      <div className="w-full flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex items-center justify-center w-full">
          <Controller
              control={control}
              name="profilePic"
              render={({ field }) => (
                  <ImageUploadZone value={field.value} onChange={field.onChange} />
              )}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showCreatedBy && (
                <div className="col-span-2 flex flex-col gap-2">
                  <Label
                      htmlFor="createdBy"
                      className="text-sm font-medium text-slate-700 uppercase"
                  >
                    This Profile is Created By
                  </Label>
                  <Controller
                      name="createdBy"
                      control={control}
                      render={({field}) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select relationship"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self">Myself</SelectItem>
                              <SelectItem value="parent">Parent / Guardian</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                      )}
                  />
                  {errors.createdBy && (
                      <p className="text-xs text-red-500">
                        {errors.createdBy.message as string}
                      </p>
                  )}
                </div>
            )}

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Full Name
              </Label>
              <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  {...register("fullName")}
              />
              {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message as string}
                  </p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="contact"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Contact Number
              </Label>
              <Input
                  id="contact"
                  type="text"
                  placeholder="07X XXX XXXX"
                  {...register("contact")}
              />
              {errors.contact && (
                  <p className="text-sm text-red-600">
                    {errors.contact.message as string}
                  </p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="maritalStatus"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Marital Status
              </Label>
              <Controller
                  control={control}
                  name="maritalStatus"
                  render={({field}) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Marital Status"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="never_married">Never Married</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
              {errors.maritalStatus && (
                  <span className="text-sm text-red-600">
                {errors.maritalStatus.message as string}
              </span>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Gender
              </Label>
              <Controller
                  control={control}
                  name="gender"
                  render={({field}) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
              {errors.gender && (
                  <span className="text-sm text-red-600">
                {errors.gender.message as string}
              </span>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="dob"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Date of Birth
              </Label>
              <Input id="dob" type="date" {...register("dob")} />
              {errors.dob && (
                  <span className="text-sm text-red-600">
                {errors.dob.message as string}
              </span>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 flex flex-col gap-2">
              <Label
                  htmlFor="age"
                  className="text-sm font-medium text-slate-700 uppercase"
              >
                Age
              </Label>
              <Controller
                  control={control}
                  name="age"
                  render={({field}) => (
                      <Select
                          value={field.value ? field.value.toString() : ""}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select age"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ageOptions.map((age) => (
                                <SelectItem value={age.toString()} key={age}>
                                  {age}
                                </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
              {errors.age && (
                  <span className="text-sm text-red-600">
                {errors.age.message as string}
              </span>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

function BasicInformationOnboarding({onPrev, onNext, initialData}: StepOneProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepOneBasicSchema as any),
    defaultValues: {
      createdBy: initialData?.createdBy || undefined,
      profilePic: initialData?.profilePic || "",
      fullName: initialData?.fullName || "",
      contact: initialData?.contact || "",
      gender: initialData?.gender || undefined,
      dob: formatDate(initialData?.dob) as unknown as Date,
      age: initialData?.age || 0,
    },
  });

  return (
      <form
          onSubmit={handleSubmit((data) => onNext?.(data))}
          className="w-full flex flex-col gap-6"
      >
        <BasicInformationFields
            register={register}
            control={control}
            errors={errors}
            showCreatedBy={true}
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
          <Button
              size="lg"
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
          >
            Next Step <ArrowRight />
          </Button>
        </div>
      </form>
  );
}

function BasicInformationEditing({ onNext, initialData }: StepOneProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepOneBasicSchema as any),
    defaultValues: {
      createdBy: initialData?.createdBy || undefined,
      profilePic: initialData?.profilePic || "",
      fullName: initialData?.fullName || "",
      contact: initialData?.contact || "",
      gender: initialData?.gender || undefined,
      dob: formatDate(initialData?.dob) as unknown as Date,
      age: initialData?.age || 0,
    },
  });

  return (
      <form onSubmit={handleSubmit((data) => onNext?.(data))} className="w-full">
        <BasicInformationFields
            register={register}
            control={control}
            errors={errors}
            showCreatedBy={true}
        />

        <div className="justify-end flex w-full mt-4">
          <Button size="lg" type="submit" variant="default" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
  );
}

function BasicInformationAdmin(_props: StepOneProps) {
  const { register, control } = useFormContext<OnboardingFormValues>();
  const { errors } = useFormState({ control });

  return (
      <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <User size={22} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Basic Details</h4>
        </div>

        <BasicInformationFields
            register={register}
            control={control}
            errors={errors}
            showCreatedBy={false}
        />
      </section>
  );
}

const BasicInformation = ({ onPrev, onNext, initialData, variant = "onboarding" }: StepOneProps) => {
  if (variant === "admin") {
    return <BasicInformationAdmin variant={variant} initialData={initialData} />;
  }
  if (variant === "editing") {
    return (
        <BasicInformationEditing variant={variant} onNext={onNext} initialData={initialData} />
    );
  }
  return (
      <BasicInformationOnboarding
          variant={variant}
          onPrev={onPrev}
          onNext={onNext}
          initialData={initialData}
      />
  );
};

export default BasicInformation;
