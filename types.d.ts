declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onBan?: (userId: string) => void;
    onReactivate?: (userId: string) => void;
    onApprove?: (userId: string) => void;
    onReject?: (userId: string) => void;
  }
}

export type CreatedByTypes =
  | "self"
  | "parent"
  | "guardian"
  | "sibling"
  | "friend";
export type GenderTypes = "male" | "female";
export type ResindencyTypes = "CITIZEN" | "PR" | "WORK";
export type UserStatusTypes = "active" | "banned";
export type BadHabitTypes = "never" | "occasionally" | "regularly";
export type TabTypes = "all" | "pending" | "approved" | "rejected";
export type MailRoutingTargetTypes = "owner" | "candidate" | "both";
export type ProfileStatusTypes = "pending" | "approved" | "rejected";
export type FoodHabitTypes = "vegetarian" | "non-vegetarian" | "vegan";
export type MembershipTypes = "free_tier" | "classical" | "heritage" | null;
export type MaritalStatusTypes = "never_married" | "divorced" | "widowed";

export interface StepConfig {
  id: number;
  tagline: string;
  title: string;
}

export interface ProgressBarHeaderProps {
  currentStep: number;
  steps: StepConfig[];
}

export interface InitialProfileData {
  userId?: string;
  createdBy?: CreatedByTypes;
  profilePic?: string;
  fullName?: string;
  contact?: string;
  gender?: GenderTypes;
  dob?: Date;
  age?: number;
  religion?: string;
  caste?: string;
  motherTongue?: string;
  educationLevel?: string;
  profession?: string;
  annualIncomeRange?: string;
  country?: string;
  state?: string;
  city?: string;
  residencyStatus?: ResindencyTypes;
  height?: string | undefined;
  weight?: string | undefined;
  age?: number;
  smoking?: BadHabitTypes;
  drinking?: BadHabitTypes;
  foodPreferences?: FoodHabitTypes;
  isDifferentlyAbled?: boolean;
  differentlyAbledDetails?: string;
  narrative?: string;
  foodPreferences?: FoodHabitTypes;
  isDifferentlyAbled?: boolean;
  differentlyAbledDetails?: string;
  narrative?: string;
  hobbies?: string[];
  status?: ProfileStatusTypes;
  mailRoutingTarget?: MailRoutingTargetTypes;
  secondaryEmail?: string;
  preferredMinAge?: number | null;
  preferredMaxAge?: number | null;
  preferredMaritalStatus?: MaritalStatusTypes;
  preferredEducationLevels?: string[];
  preferredProfessions?: string[];
  preferredAnnualIncomeRanges?: string[];
}
export interface StepOneInitialData {
  initialData: {
    createdBy?: CreatedByTypes;
    profilePic?: string;
    fullName?: string;
    contact?: string;
    gender?: GenderTypes;
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
    residencyStatus?: ResindencyTypes;
  };
}

export interface StepFiveInitialData {
  initialData: {
    height?: string | number;
    weight?: string | number;
    age?: number;
    smoking?: BadHabitTypes;
    drinking?: BadHabitTypes;
    foodPreferences?: FoodHabitTypes;
    isDifferentlyAbled?: boolean;
    differentlyAbledDetails?: string;
    narrative?: string;
  };
}

export interface StepSevenInitialData {
  initialData: {
    preferredMinAge?: number | null;
    preferredMaxAge?: number | null;
    preferredMaritalStatus?: string | null;
    preferredEducationLevels?: string[] | null;
    preferredProfessions?: string[] | null;
    preferredAnnualIncomeRanges?: string[] | null;
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

export interface ProfileCardData {
  id: string;
  fullName: string | null;
  profilePic: string | null;
  age: number | null;
  height: string | number | null;
  country: string | null;
  profession: string | null;
  religion: string | null;
  caste: string | null;
  educationLevel: string | null;
  isFavorited?: boolean; // Optional initial favorite state
}

export interface ProfileCardProps {
  currentProfileId: string; // The ID of the logged-in user's profile
  profileCardData: ProfileCardData;
  routing:string;
}
