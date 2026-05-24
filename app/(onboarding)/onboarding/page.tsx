"use client";

import { useState } from "react";
import BasicInformation from "@/components/forms/onboarding-basic-form";
import ProgressBarHeader from "@/components/landing/progress-bar-header";
import { ONBOARDING_STEPS } from "@/lib/constants";
import ReligionInformation from "@/components/forms/onboarding-religion-form";
import AchievementsForm from "@/components/forms/onboarding-achievements-form";
import LocationInformation from "@/components/forms/onboarding-location-form";
import FinalInformation from "@/components/forms/onboarding-final-form";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [initialData, setInitialData] = useState<Record<string, any>>({});

  const onNext = async (stepData: Record<string, any>) => {
    // Merge new step inputs with previous step inputs
    const updatedData = { ...initialData, ...stepData };
    setInitialData(updatedData);

    if (currentStep < 5) {
      // Advance to next step view
      setCurrentStep((prev) => prev + 1);

      // OPTIONAL INDUSTRIAL PRACTICE: Save draft progress to your backend here
      // await updateDraftOnboarding(updatedData, currentStep + 1);
    } else {
      // We are on Step 5, trigger final submission to database
      await handleFinalSubmit(updatedData);
    }
  };

  const onPrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (finalPayload: Record<string, any>) => {
    console.log("Ready for Server Action submission:", finalPayload);
    // Call your server action here to save to Drizzle Postgres and redirect to dashboard
  };
  return (
    <div className="w-full py-10 px-6 md:px-0 mx-auto md:max-w-4xl">
      <ProgressBarHeader currentStep={currentStep} steps={ONBOARDING_STEPS} />

      {currentStep === 1 && (
        <BasicInformation initialData={initialData} onNext={onNext} />
      )}
      {currentStep === 2 && <ReligionInformation initialData={initialData} onNext={onNext} onPrev={onPrev} />}
      {currentStep === 3 && <AchievementsForm />}
      {currentStep === 4 && <LocationInformation />}
      {currentStep === 5 && <FinalInformation />}
    </div>
  );
};

export default OnboardingPage;
