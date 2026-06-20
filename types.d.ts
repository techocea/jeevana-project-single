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
    age?: number;
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
    height?: string | number;
    weight?: string | number;
    age?: number;
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

export interface SearchFilters {
  lookingFor?: string;
  minAge?: string;
  maxAge?: string;
  religion?: string;
  caste?: string; // comma separated
  motherTongue?: string;
  educationLevel?: string;
  profession?: string;
  annualIncomeRange?: string;
  country?: string;
  state?: string;
  hobbies?: string; // comma separated
}

export interface ProfileCardProps {
  // profileId?: string | null;
  fullName: string | null;
  profilePic: string | null;
  paymentStatus: string | null;
  age: number | null;
  height: string | number | null;
  country: string | null;
  profession: string | null;
  religion: string | null;
  caste: string | null;
  educationLevel: string | null;
}

export type TabTypes = "all" | "pending" | "approved" | "rejected";
export type StatusTypes = "pending" | "approved" | "rejected";
