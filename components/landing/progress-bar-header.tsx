import React from "react";
import {Save} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ProgressBarHeaderProps} from "@/types";
import TitleHeader from "@/components/dashboard/title-header";

const ProgressBarHeader = ({currentStep, steps}: ProgressBarHeaderProps) => {
    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
            <TitleHeader
                title={"create your matrimonial profile"}
                description={`Step ${currentStep} of ${steps.length} — All sensitive contact fields remain private and staff-checked.`}
                isGreeting={false}/>

          <div className="flex items-center gap-2">
            <Button
                variant="outline"
                type="button"
                // onClick={handleSaveAndExit}
              >
              <Save className="w-3.5 h-3.5 text-secondary-foreground/80 hover:text-secondary-foreground" />
              <span>Save & Exit</span>
            </Button>
          </div>
            {/*<Progress value={progressPercentage} className="w-full" />*/}
        </div>
    );
};

export default ProgressBarHeader;
