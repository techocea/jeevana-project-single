"use client";

import AdminCreateAdForm from "@/components/forms/admin-create-ad-form";
import TitleHeader from "@/components/dashboard/title-header";
import { FormProvider, useForm } from "react-hook-form";
import { AdminCreateAdFormValues } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, UserCheck } from "lucide-react";
import UserProfileSearch from "@/components/dashboard/user-profile-search";
import { useRouter } from "next/navigation";
import { createAdminProfileAction } from "@/app/actions/onboarding-actions";

const CreateAdPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AdminCreateAdFormValues>({
    defaultValues: {
      userId: "",
      createdBy: undefined,
      profilePic: "",
      fullName: "",
      contact: "",
      gender: undefined,
      dob: undefined,
      religion: "",
      caste: "",
      motherTongue: "",
      educationLevel: "",
      profession: "",
      annualIncomeRange: "",
      country: "",
      state: "",
      city: "",
      residencyStatus: undefined,
      height: "",
      weight: "",
      age: 0,
      smoking: "never",
      drinking: "never",
      foodPreferences: "vegetarian",
      isDifferentlyAbled: false,
      differentlyAbledDetails: "",
      narrative: "",
      hobbies: [""],
      status: "pending",
      mailRoutingTarget: "owner",
      secondaryEmail: "",
    },
  });

  const { watch, setValue } = methods;
  const selectedUserId = watch("userId");

  const [selectedUserName, setSelectedUserName] = useState<string | "">("");

  const handleClearUser = () => {
    setValue("userId", "");
    setSelectedUserName("");
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const onSubmit = async (data: AdminCreateAdFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!data.userId) {
      setSubmitError("Search and select a registered user before publishing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAdminProfileAction(data, data.userId);
      if (!result.success) {
        setSubmitError(result.error || "Failed to create the advertisement profile.");
        return;
      }
      setSubmitSuccess("Advertisement profile saved successfully.");
      router.push("/control-panel/approval-queues");
    } catch (error) {
      console.error("[ADMIN_AD_SUBMIT_ERROR]:", error);
      setSubmitError("An unexpected error occurred while saving the profile.");
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
              {submitError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}
              {submitSuccess ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {submitSuccess}
                </div>
              ) : null}
              {selectedUserId && <AdminCreateAdForm />}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;
