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
export type ResindencyTypes = "CITIZEN" | "PR_VISA" | "WORK_VISA" | "STUDENT_VISA" | "ASYLUM";
export type UserStatusTypes = "active" | "banned";
export type BadHabitTypes = "never" | "occasionally" | "regularly";
export type TabTypes = "all" | "pending" | "approved" | "rejected";
export type MailRoutingTargetTypes = "owner" | "candidate" | "both";
export type ProfileStatusTypes = "pending" | "approved" | "rejected";
export type VerificationStatusTypes = "pending" | "verified" | "rejected";
export type FoodHabitTypes = "vegetarian" | "non_vegetarian" | "vegan";
export type MembershipTypes = "free_tier" | "classical" | "heritage";
export type MaritalStatusTypes = "single" | "divorced" | "widowed";
export type ComplexionTypes = "very_fair" | "fair" | "medium" | "brown" | "dark_brown" | "black";
export type BodyTypes = "slim" | "athletic" | "average" | "small" | "not_specified";
export type BloodGroupTypes = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" |  "not_specified";


export interface StepConfig {
    id: number;
    title: string;
    subtitle: string;
}

export interface ProgressBarHeaderProps {
    currentStep: number;
    steps: StepConfig[];
}

export interface InitialProfileData {
    userId?: string;
    createdBy?: CreatedByTypes;
    fullName?: string;
    contact?: string;
    gender?: GenderTypes;
    dob?: Date;
    age?: number;
    religion?: string;
    maritalStatus?: MaritalStatusTypes;
    caste?: string;
    subCaste?: string;
    motherTongue?: string;

    height?: string | undefined;
    weight?: string | undefined;
    complexion?: ComplexionTypes;
    bodyType?: BodyTypes;
    bloodGroup?: BloodGroupTypes;
    smoking?: BadHabitTypes;
    drinking?: BadHabitTypes;
    foodPreferences?: FoodHabitTypes;
    isDifferentlyAbled?: boolean;
    differentlyAbledDetails?: string;

    educationLevel?: string;
    educationDescription?:string;
    profession?: string;
    employedIn?: string;
    annualIncomeRange?: string;

    country?: string;
    state?: string;
    city?: string;
    residencyStatus?: ResindencyTypes;

    narrative?: string;
    profilePic?: string;
    hobbies?: string[];

    status?: ProfileStatusTypes;
    mailRoutingTarget?: MailRoutingTargetTypes;
    secondaryEmail?: string;

    preferredMinAge?: number;
    preferredMaxAge?: number;
    preferredMinHeight?: number;
    preferredMaxHeight?: number;
    preferredMaritalStatus?: MaritalStatusTypes;
    preferredReligions?: string[];
    preferredCastes?: string[];
    preferredEducationLevels?: string[];
    preferredProfessions?: string[];
    preferredAnnualIncomeRanges?: string[];
    preferredResidencyStatuses?: string[];
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
        religion?: string;
        maritalStatus?: MaritalStatusTypes;
        caste?: string;
        subCaste?: string;
        motherTongue?: string;
    };
}

export interface StepTwoInitialData {
    initialData: {
        height?: string | undefined;
        weight?: string | undefined;
        complexion?: ComplexionTypes;
        bodyType?: BodyTypes;
        bloodGroup?: BloodGroupTypes;
        smoking?: BadHabitTypes;
        drinking?: BadHabitTypes;
        foodPreferences?: FoodHabitTypes;
        isDifferentlyAbled?: boolean;
        differentlyAbledDetails?: string;
    };
}

export interface StepThreeInitialData {
    initialData: {
        educationLevel?: string;
        educationDescription?:string;
        profession?: string;
        employedIn?: string;
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
        narrative?: string;
        profilePic?: string;
        hobbies?: string[];
    };
}

export interface StepSixInitialData {
    initialData: {
        preferredMinAge?: number;
        preferredMaxAge?: number;
        preferredMinHeight?: number;
        preferredMaxHeight?: number;
        preferredMaritalStatus?: MaritalStatusTypes;
        preferredReligions?: string[];
        preferredCastes?: string[];
        preferredEducationLevels?: string[];
        preferredProfessions?: string[];
        preferredAnnualIncomeRanges?: string[];
        preferredResidencyStatuses?: string[];
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
    maritalStatus?: MaritalStatusTypes;
    foodPreferences?: FoodHabitTypes;
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
    maritalStatus: MaritalStatusTypes | null;
    foodPreferences: string | null;
    religion: string | null;
    caste: string | null;
    educationLevel: string | null;
    isVerified?: boolean; // Optional initial favorite state
}

export interface ProfileCardDataProps {
    profileCardData: ProfileCardData;
}
