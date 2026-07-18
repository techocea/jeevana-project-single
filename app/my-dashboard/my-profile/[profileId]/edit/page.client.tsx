"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { updateProfile } from "@/app/actions/profile-actions";
import { formatDate } from "@/helpers/format-date";
import { ArrowLeft } from "lucide-react";

// Import form components for each step
import BasicInformationForm from "@/components/forms/onboarding-basic-form";
import ReligionForm from "@/components/forms/onboarding-religion-form";
import AchievementsForm from "@/components/forms/onboarding-achievements-form"; // or career step
import LocationForm from "@/components/forms/onboarding-location-form";
import PersonalForm from "@/components/forms/onboarding-personal-form";
import HobbiesForm from "@/components/forms/onboarding-hobbies-form";
import { InitialProfileData } from "@/types";

interface EditProfileProps {
  initialData: InitialProfileData;
  profileId: string;
}

const EditProfile = ({ initialData, profileId }: EditProfileProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "basic" | "religion" | "career" | "location" | "personal" | "hobbies"
  >("basic");

  const handleSaveStep = async (stepData: any) => {
    try {
      const sanitizedData = { ...stepData };

      if (sanitizedData.dob) {
        sanitizedData.dob = new Date(sanitizedData.dob);
      }

      const result = await updateProfile(profileId, sanitizedData);
      if (result.success) {
        router.refresh();
        console.log("Step saved successfully:", result.data);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <main className="">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-semibold text-slate-950">
              Edit Profile
            </h1>
          </div>
        </div>

        {/* Tabs for different sections */}
        <div className="mb-2 bg-white rounded-lg flex gap-2 overflow-x-auto border-b border-slate-200 p-2">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "religion", label: "Religion" },
            { id: "career", label: "Career" },
            { id: "location", label: "Location" },
            { id: "personal", label: "Personal" },
            { id: "hobbies", label: "Hobbies" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted hover:text-primary hover:border-b-2 delay-100 transition-colors"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form content based on active tab */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {activeTab === "basic" && (
            <BasicInformationForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "religion" && (
            <ReligionForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "career" && (
            <AchievementsForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "location" && (
            <LocationForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "personal" && (
            <PersonalForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
          {activeTab === "hobbies" && (
            <HobbiesForm
              variant="inline"
              initialData={initialData}
              onNext={handleSaveStep}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
