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
    | "friend" | null;
export type GenderTypes = "male" | "female" | null;
export type ResindencyTypes = "CITIZEN" | "PR" | "WORK" | null;
export type UserStatusTypes = "active" | "banned" | null;
export type BadHabitTypes = "never" | "occasionally" | "regularly" | null;
export type TabTypes = "all" | "pending" | "approved" | "rejected" | null;
export type MailRoutingTargetTypes = "owner" | "candidate" | "both";
export type ProfileStatusTypes = "pending" | "approved" | "rejected" | null;
export type VerificationStatusTypes = "pending" | "verified" | "rejected" | null;
export type FoodHabitTypes = "vegetarian" | "non-vegetarian" | "vegan" | null;
export type MembershipTypes = "free_tier" | "classical" | "heritage" | null;
export type MaritalStatusTypes = "never_married" | "divorced" | "widowed" | null;

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

    smoking?: BadHabitTypes;
    drinking?: BadHabitTypes;
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
    caste?: string;
    maritalStatus?: MaritalStatusTypes | null;
    foodPreferences?: FoodHabitTypes | null;
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
    maritalStatus: MaritalStatusTypes | null;
    foodPreferences: FoodHabitTypes | null | string;
    profession: string | null;
    religion: string | null;
    caste: string | null;
    educationLevel: string | null;
    isVerified?: boolean;
}

export interface ProfileCardDataProps {
    profileCardData: ProfileCardData;
}
