"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { updateProfile } from "@/app/actions/profile-actions";
import { InitialProfileData } from "@/types";
import toast from "react-hot-toast";
import OnboardingFormOne from "@/components/forms/onboarding-one-form";
import OnboardingFormTwo from "@/components/forms/onboarding-two-form";
import OnboardingFormThree from "@/components/forms/onboarding-three-form";
import OnboardingFormFour from "@/components/forms/onboarding-four-form";
import OnboardingFormFive from "@/components/forms/onboarding-five-form";


interface EditProfileProps {
  initialData: InitialProfileData;
  profileId: string;
}

const EditProfile = ({ initialData, profileId }: EditProfileProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "basic"
    | "attributes_habits"
    | "education_career"
    | "about_me_photos"
    | "partner_preferences"
  >("basic");

  const handleSaveStep = async (stepData: any) => {
    try {
      const sanitizedData = { ...stepData };

      if (sanitizedData.dob) {
        sanitizedData.dob = new Date(sanitizedData.dob);
      }

      const result = await updateProfile(profileId, sanitizedData);
      if (!result.success) {
        toast.error(result.error || "Failed to update profile!");
        return;
      }
      toast.success("Data Saved Successfully!");
      router.back();
    } catch (error) {
      toast.error("Error in updating data!");
      console.error("ERROR_UPDATING_DATA:", error);
    }
  };

  return (
     <div className="bg-white rounded-lg border border-[#E8E2D7] shadow-sm overflow-hidden">
        {/* Tabs for different sections */}
        <div className="mb-2 bg-[#FAF8F5] px-6 border-b border-strong flex items-center gap-3 flex-wrap">
          {[
            { id: "basic", label: "Basic Details" },
            { id: "attributes_habits", label: "Attributes & Habits" },
            { id: "education_career", label: "Education & Career" },
            { id: "about_me_photos", label: "About Me & Photos" },
            { id: "partner_preferences", label: "Partner Preferences" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer ${activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-primary hover:border-b-2 delay-100 transition-colors"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form content based on active tab */}
        <div className="p-6">
          {activeTab === "basic" && (
            <OnboardingFormOne
              variant="editing"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "attributes_habits" && (
            <OnboardingFormTwo
              variant="editing"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "education_career" && (
            <OnboardingFormThree
              variant="editing"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "about_me_photos" && (
            <OnboardingFormFour
              variant="editing"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "partner_preferences" && (
            <OnboardingFormFive
              variant="editing"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
        </div>
      </div>
  );
};

export default EditProfile;
