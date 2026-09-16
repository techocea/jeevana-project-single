"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowRightLeft, Loader2,
  ShieldCogCorner,
  UserCheck,
} from "lucide-react";
import ReligionInformation from "@/components/forms/onboarding-religion-form";
import AchievementsForm from "@/components/forms/onboarding-achievements-form";
import LocationInformation from "@/components/forms/onboarding-location-form";
import PersonalInformation from "@/components/forms/onboarding-personal-form";
import HobbiesSelector from "@/components/forms/onboarding-hobbies-form";
import PartnerPreferences from "@/components/forms/partner-preferences-form";
import BasicInformation from "@/components/forms/onboarding-basic-form";
import TitleHeader from "@/components/dashboard/title-header";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InitialProfileData } from "@/types";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserProfileSearch from "@/components/dashboard/user-profile-search";
import { useRouter } from "next/navigation";
import { createProfileByAdmin } from "@/app/actions/profile-actions";
import toast from "react-hot-toast";

const CreateAdPage = ({ initialData }: { initialData: InitialProfileData }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<InitialProfileData>({
    defaultValues: {
      ...initialData,
      userId: initialData?.userId || "",
      status: initialData?.status || "approved",
      mailRoutingTarget: initialData?.mailRoutingTarget || "owner",
      secondaryEmail: initialData?.secondaryEmail || "",
      createdBy: initialData?.createdBy || "self",
    }
  });

  const { watch, setValue, control } = methods;

  const selectedUserId = watch("userId");
  const mailRoutingTarget = watch("mailRoutingTarget");
  const showSecondaryEmail =
    mailRoutingTarget === "candidate" || mailRoutingTarget === "both";

  const [selectedUserName, setSelectedUserName] = useState<string | "">("");

  const handleClearUser = () => {
    setValue("userId", "");
    setSelectedUserName("");
  };

  const onSubmit = async (data: InitialProfileData) => {
    if (!data.userId) {
      toast.error("Search and select a registered user before publishing.");
      console.log("User ID is missing:", data.userId);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("[Submitting data:]", data);
      const result = await createProfileByAdmin(data, data.userId);

      console.log("[Admin Profile Create Result:]", result);
      if (!result?.success) {
        toast.error(result?.error || "Failed to create the advertisement profile.");
        return;
      }
      toast.success("Profile created successfully!");
      router.push("/control-panel/approval-queues");
    } catch (error) {
      console.error("[ADMIN_AD_SUBMIT_ERROR]:", error);
      toast.error("An unexpected error occurred while saving the profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TitleHeader
            isGreeting={false}
            title="curate advertisement"
            description="Prepare and verify the editorial narrative for public distribution."
          />

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {!selectedUserId ? (
                <UserProfileSearch
                  onSelectUser={(name) => setSelectedUserName(name)}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg  p-5 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 border border-pink-100">
                      <UserCheck size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Linked Account
                      </p>
                      <h4 className="text-base font-semibold text-slate-900">
                        {selectedUserName || "System User Account Connected"}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {selectedUserId}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearUser}
                  >
                    <ArrowRightLeft size={14} />
                    Change Account
                  </Button>
                </div>
              )}

              {selectedUserId && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* SECTION 1: Basic Details */}
                  <BasicInformation initialData={initialData} variant="admin" />

                  {/* SECTION 2: Religion */}
                  <ReligionInformation
                    initialData={initialData}
                    variant="admin"
                  />

                  {/* SECTION 3: Location */}
                  <LocationInformation
                    initialData={initialData}
                    variant="admin"
                  />

                  {/* SECTION 4: Career */}
                  <AchievementsForm initialData={initialData} variant="admin" />

                  {/* SECTION 5: Personal Info */}
                  <PersonalInformation
                    initialData={initialData}
                    variant="admin"
                  />

                  {/* SECTION 6: Hobbies */}
                  <HobbiesSelector initialData={initialData} variant="admin" />

                  {/* SECTION 7: Partner Preferences */}
                  <PartnerPreferences
                    initialData={initialData}
                    variant="admin"
                  />

                  {/* SECTION 7: Admin Overrides */}
                  <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
                      <ShieldCogCorner size={26} className="text-secondary" />
                      <h4 className="text-black font-newsreader text-xl">
                        Admin Overrides
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-3">
                      {/* Input 1: Created By */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="createdBy"
                          className="text-sm font-medium text-muted"
                        >
                          Profile Created By
                        </Label>
                        <Controller
                          name="createdBy"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="createdBy"
                                className="w-full bg-white shadow-sm border-slate-200"
                              >
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="self">Myself</SelectItem>
                                <SelectItem value="parent">
                                  Parent / Guardian
                                </SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Input 2: Profile Status */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="status"
                          className="text-sm font-medium text-muted"
                        >
                          Matchmaking Status
                        </Label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="status"
                                className="w-full bg-white shadow-sm border-slate-200"
                              >
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  Hold in Pending
                                </SelectItem>
                                <SelectItem value="approved">
                                  Instantly Approved
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    {/* BOTTOM LAYER: Card Selections & Dynamic Form Field */}
                    <div className="space-y-1.5">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted">
                          System Notification Routing
                        </Label>
                      </div>

                      <Controller
                        control={control}
                        name="mailRoutingTarget"
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-1 gap-2"
                          >
                            {/* Option 1 */}
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                              <RadioGroupItem
                                value="owner"
                                id="routing-owner"
                                className="border-slate-300 text-pink-600 focus:ring-pink-500"
                              />
                              <Label
                                htmlFor="routing-owner"
                                className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                              >
                                Account Owner Only
                              </Label>
                            </div>

                            {/* Option 2 */}
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                              <RadioGroupItem
                                value="candidate"
                                id="routing-candidate"
                                className="border-slate-300 text-pink-600 focus:ring-pink-500"
                              />
                              <Label
                                htmlFor="routing-candidate"
                                className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                              >
                                Candidate Only
                              </Label>
                            </div>

                            {/* Option 3 */}
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                              <RadioGroupItem
                                value="both"
                                id="routing-both"
                                className="border-slate-300 text-pink-600 focus:ring-pink-500"
                              />
                              <Label
                                htmlFor="routing-both"
                                className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                              >
                                Both Addresses
                              </Label>
                            </div>
                          </RadioGroup>
                        )}
                      />

                      {/* DYNAMIC FIELD: Captures the second optional target email address */}
                      {showSecondaryEmail && (
                        <div className="pt-3 border-t border-slate-100 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                          <Label
                            htmlFor="secondaryEmail"
                            className="text-xs font-semibold text-slate-600"
                          >
                            Candidate Email Address{" "}
                            <span className="text-slate-400 font-normal">
                              (Optional)
                            </span>
                          </Label>
                          <Controller
                            name="secondaryEmail"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="secondaryEmail"
                                type="email"
                                placeholder="Enter candidate's secondary contact email..."
                                className="w-full border-slate-200"
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  <div className="justify-end flex">
                    <Button
                      size="lg"
                      type="submit"
                      disabled={isSubmitting}
                      variant="secondary"
                      className="w-fit uppercase py-3 px-5 flex gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin transition-all"/> :
                          <>
                        Save as Draft
                        <ArrowRight />
                      </>
                      }
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;
