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
    createdBy?: "self" | "parent" | "guardian" | "sibling" | "friend";
    profilePic?: string;
    fullName?: string;
    contact?: string;
    gender?: "MALE" | "FEMALE";
    dob?: Date;
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
    residencyStatus?: "CITIZEN" | "PR" | "WORK";
  };
}

export interface StepFiveInitialData {
  initialData: {
    height?: text;
    weight?: text;
    smoking?: "never" | "occasionally" | "regularly";
    drinking?: "never" | "socially" | "regularly";
    foodPreferences?: "vegetarian" | "non-vegetarian" | "vegan";
    isDifferentlyAbled?: boolean;
    differentlyAbledDetails?: string;
    narrative?: string;
  };
}

export interface LocationNode {
  value: string;
  isoCode?: string;
}

export interface LKRegionMap {
  [district: string]: string[];
}

export interface ProfessionCategory {
  [category: string]: string[];
}
