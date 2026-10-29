"use client";

import {useState} from "react";
import {Check} from "lucide-react";
import {Button} from "@base-ui/react";
import {useRouter} from "next/navigation";
import {ONBOARDING_STEPS} from "@/lib/constants";
import {createProfileByUser} from "@/app/actions/profile-actions";
import BasicInformation from "@/components/forms/onboarding-basic-form";
import ProgressBarHeader from "@/components/landing/progress-bar-header";
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
    const [initialData, setInitialData] = useState<Record<string, any>>(
        initialDbData || {},
    );
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const onNext = async (stepData: Record<string, any>) => {
        const updatedData = {...initialData, ...stepData};
        setInitialData(updatedData);

        try {
            setIsSyncing(true);
            const result = await createProfileByUser(currentStep, stepData);

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
        <div className="w-full py-10 px-6 md:px-0 mx-auto max-w-6xl min-h-full">
            {/*{isSyncing && (*/}
            {/*    <div*/}
            {/*        className="absolute inset-0 bg-white/40 z-50 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto h-full">*/}
            {/*        <div className="flex items-center gap-2 bg-white shadow-md border rounded-xl px-4 py-2">*/}
            {/*            <Loader2 className="h-5 w-5 animate-spin text-secondary"/>*/}
            {/*            <span className="text-sm font-medium text-slate-600">*/}
            {/*  Saving progress...*/}
            {/*</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            <ProgressBarHeader currentStep={currentStep} steps={ONBOARDING_STEPS}/>

            {/* Wizard Layout: Desktop Step Sidebar & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Step Navigation Bar */}
                <aside className="lg:col-span-3 bg-white border border-[#E8E2D7] rounded-lg p-4 sm:p-5 shadow-2xs">
                    <div className="text-xs font-semibold text-[#1F1B18] mb-3 pb-2 border-b border-[#F2ECE3]">
                        Registration Progress
                    </div>

                    {/* Desktop step list */}
                    <div className="space-y-1 hidden lg:block">
                        {ONBOARDING_STEPS.map((s) => {
                            const isPassed = currentStep > s.id;
                            const isCurrent = currentStep === s.id;

                            return (
                                <Button
                                    key={s.id}
                                    onClick={() => setCurrentStep(s.id)}
                                    className={`w-full text-left p-2.5 rounded-md flex items-center gap-3 transition-colors ${
                                        isCurrent
                                            ? 'bg-[#F6EFE2] text-[#8E6516] font-semibold ring-1 ring-[#8E6516]/20'
                                            : isPassed
                                                ? 'text-[#4A423A] hover:bg-[#FBF9F5]'
                                                : 'text-[#9E9383] hover:bg-[#FBF9F5]'
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-medium ${
                                            isPassed
                                                ? 'bg-[#15803D] text-white'
                                                : isCurrent
                                                    ? 'bg-[#8E6516] text-white'
                                                    : 'bg-[#F0EAE1] text-[#7A7065]'
                                        }`}
                                    >
                                        {isPassed ? <Check className="w-3.5 h-3.5"/> : s.id}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs truncate">{s.title}</div>
                                        <div className="text-[10px] text-[#8C8375] truncate">{s.subtitle}</div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Mobile compact stepper */}
                    <div className="lg:hidden flex items-center justify-between text-xs text-[#554D45]">
            <span className="font-semibold text-[#8E6516]">
              Step {currentStep}: {ONBOARDING_STEPS[currentStep - 1].title}
            </span>
                        <span className="text-[#8C8375]">
              {Math.round((currentStep / 6) * 100)}% complete
            </span>
                    </div>
                    <div className="lg:hidden w-full bg-[#EAE4D9] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                            className="bg-[#8E6516] h-full transition-all duration-300"
                            style={{width: `${(currentStep / 6) * 100}%`}}
                        />
                    </div>
                </aside>

                {/* Step Content Area */}
                <div className="lg:col-span-9 bg-white border border-[#E8E2D7] rounded-lg p-6 sm:p-8 shadow-2xs">
                    {currentStep === 1 && (
                        <BasicInformation
                            variant="onboarding"
                            initialData={initialData}
                            onNext={onNext}
                        />
                    )}
                    {currentStep === 2 && (
                        <ReligionInformation
                            variant="onboarding"
                            initialData={initialData}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    )}
                    {currentStep === 3 && (
                        <AchievementsForm
                            variant="onboarding"
                            initialData={initialData}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    )}
                    {currentStep === 4 && (
                        <LocationInformation
                            variant="onboarding"
                            initialData={initialData}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    )}
                    {currentStep === 5 && (
                        <PersonalInformation
                            variant="onboarding"
                            initialData={initialData}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    )}
                    {currentStep === 6 && (
                        <HobbiesSelector
                            variant="onboarding"
                            initialData={initialData}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    )}
                    {currentStep === 7 && (
                        <PartnerPreferences
                            variant="onboarding"
                            initialData={initialData}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPageClient;
