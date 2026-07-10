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
import CareerForm from "@/components/forms/onboarding-personal-form"; // or career step
import LocationForm from "@/components/forms/onboarding-location-form";
import PersonalForm from "@/components/forms/onboarding-personal-form";
import HobbiesForm from "@/components/forms/onboarding-hobbies-form";
import { Profile } from "@/types";

interface EditProfileProps {
    initialData: Profile;
    profileId: string;
}

const EditProfile = ({ initialData, profileId }: EditProfileProps) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "basic" | "religion" | "career" | "location" | "personal" | "hobbies"
    >("basic");

    const handleSaveStep = async (stepData: any) => {
        setIsSaving(true);
        try {
            const result = await updateProfile(profileId, stepData);
            if (result.success) {
                // Show success toast
                console.log("Step saved successfully");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            // Collect all form data and save
            const result = await updateProfile(profileId, initialData);
            if (result.success) {
                router.push("/my-dashboard");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-white px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="p-0"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="text-2xl font-semibold text-slate-950">
                            Edit Profile
                        </h1>
                    </div>
                    <Button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="bg-blue-600 text-white"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {/* Tabs for different sections */}
                <div className="mb-8 flex gap-2 overflow-x-auto border-b border-slate-200">
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
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-muted"
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
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                    {activeTab === "religion" && (
                        <ReligionForm
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                    {activeTab === "career" && (
                        <CareerForm
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                    {activeTab === "location" && (
                        <LocationForm
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                    {activeTab === "personal" && (
                        <PersonalForm
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                    {activeTab === "hobbies" && (
                        <HobbiesForm
                            initialData={initialData}
                            onNext={handleSaveStep}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}

export default EditProfile