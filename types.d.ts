export interface StepConfig {
  id: number;
  tagline: string;
  title: string;
}

export interface ProgressBarHeaderProps {
  currentStep: number;
  steps: StepConfig[];
}

export interface StepOneInitialData {
  initialData: {
    fullName?: string;
    contact?: string;
    gender?: "MALE" | "FEMALE";
    dob?: string;
  };
}

export interface StepTwoInitialData {
  initialData: {
    religion?: string;
    caste?: string;
    motherTongue?: string;
  };
}

export interface StepThreeInitialData {
  initialData: {
    educationLevel?: string;
    profession?: string;
    annualIncomeRange?: string;
  };
}

export interface StepFourInitialData {
  initialData: {
    country?: string;
    state?: string;
    city?: string;
  };
}

export interface StepFiveInitialData {
  initialData: {
    height?: string;
    weight?: string;
    narrative?: string;
  };
}
