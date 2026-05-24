import { ProgressBarHeaderProps } from "@/types";
import React from "react";
import { Progress } from "../ui/progress";

const ProgressBarHeader = ({ currentStep, steps }: ProgressBarHeaderProps) => {
  const currentStepData = steps.find((s) => s.id === currentStep) || steps[0];

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="tagline">{currentStepData.tagline}</p>
          <h2 className="italic text-black capitalize font-newsreader font-light">
            Step {currentStepData.id}: {currentStepData.title}
          </h2>
        </div>
        <p className="text-end text-lg font-semibold text-muted-foreground">
          Step {currentStep} of {steps.length}
        </p>
      </div>
      <Progress value={progressPercentage} className="w-full" />
    </div>
  );
};

export default ProgressBarHeader;
