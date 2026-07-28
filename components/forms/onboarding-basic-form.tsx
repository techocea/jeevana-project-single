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
import { useForm, Controller } from "react-hook-form";
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

const BasicInformation = ({
  onPrev,
  onNext,
  initialData,
  variant = "onboarding",
}: StepOneProps) => {
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
    <div
      className={
        variant === "editing"
          ? "w-full"
          : "w-full flex flex-col md:flex-row gap-10"
      }
    >
      {variant === "onboarding" || variant === "editing" ? (
        <div className="flex-1 flex items-center justify-center w-full">
          <Controller
            control={control}
            name="profilePic"
            render={({ field }) => (
              <ImageUploadZone value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      ) : null}

      <div className="flex-1">
        {variant === "onboarding" || variant === "editing" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select relationship" />
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
                  {errors.createdBy.message}
                </p>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-2">
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
                  {errors.fullName.message}
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
                <p className="text-sm text-red-600">{errors.contact.message}</p>
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
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
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
                  {errors.gender.message}
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
                  {errors.dob.message}
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
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value.toString() : ""}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select age" />
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
                  {errors.age.message}
                </span>
              )}
            </div>
          </div>
        ) : (
          <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
              <User size={26} className="text-secondary" />
              <h4 className="text-black font-newsreader text-xl">
                Basic Information
              </h4>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    {...register("fullName")}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted text-sm font-semibold">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    type="text"
                    placeholder="07X XXX XXXX"
                    {...register("contact")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted text-sm font-semibold">
                    Date of Birth
                  </Label>
                  <Input id="dob" type="date" {...register("dob")} />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted text-sm font-semibold">
                    Gender
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
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
                </div>
                <div className="space-y-1">
                  <Label className="text-muted text-sm font-semibold">
                    Age
                  </Label>
                  <Controller
                    control={control}
                    name="age"
                    render={({ field }) => (
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select age" />
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
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="justify-end flex w-full col-span-2 mt-4">
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

export default BasicInformation;
