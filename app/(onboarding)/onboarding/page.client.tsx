"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEPS } from "@/lib/constants";
import BasicInformation from "@/components/forms/onboarding-basic-form";
import ProgressBarHeader from "@/components/landing/progress-bar-header";
import { syncOnboardingProgressAction } from "@/app/actions/onboarding-actions";
import HobbiesSelector from "@/components/forms/onboarding-hobbies-form";
import PersonalInformation from "@/components/forms/onboarding-personal-form";
import ReligionInformation from "@/components/forms/onboarding-religion-form";
import LocationInformation from "@/components/forms/onboarding-location-form";
import AchievementsForm from "@/components/forms/onboarding-achievements-form";
import PartnerPreferences from "@/components/forms/partner-preferences-form";

interface OnboardingClientProps {
  initialDbData: Record<string, any> | null;
  savedStep: number;
}

const OnboardingPageClient = ({
  initialDbData,
  savedStep,
}: OnboardingClientProps) => {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(savedStep);
  const [initialData, setInitialData] =
    useState<Record<string, any>>(initialDbData || {});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const onNext = async (stepData: Record<string, any>) => {
    const updatedData = { ...initialData, ...stepData };
    setInitialData(updatedData);

    try {
      setIsSyncing(true);
      const result = await syncOnboardingProgressAction(currentStep, stepData);

      if (!result.success) {
        throw new Error(result.error || "Failed to preserve session progress.");
      }

      if (result.isFinished) {
        router.push(`/my-dashboard/my-profile`);
        // router.push(`/pricing?profileId=${result.profileId}`);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error("[ONBOARDING_SYNC_FAIL]:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const onPrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full py-10 px-6 md:px-0 mx-auto md:max-w-5xl">
      {isSyncing && (
        <div className="absolute inset-0 bg-white/40 z-50 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto h-full">
          <div className="flex items-center gap-2 bg-white shadow-md border rounded-xl px-4 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-secondary" />
            <span className="text-sm font-medium text-slate-600">
              Saving progress...
            </span>
          </div>
        </div>
      )}

      <ProgressBarHeader currentStep={currentStep} steps={ONBOARDING_STEPS} />

      {currentStep === 1 && (
        <BasicInformation initialData={initialData} onNext={onNext} />
      )}
      {currentStep === 2 && (
        <ReligionInformation
          initialData={initialData}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
      {currentStep === 3 && (
        <AchievementsForm
          initialData={initialData}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
      {currentStep === 4 && (
        <LocationInformation
          initialData={initialData}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
      {currentStep === 5 && (
        <PersonalInformation
          initialData={initialData}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
      {currentStep === 6 && (
        <HobbiesSelector
          initialData={initialData}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
      {currentStep === 7 && (
        <PartnerPreferences
          initialData={initialData}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </div>
  );
};

export default OnboardingPageClient;
