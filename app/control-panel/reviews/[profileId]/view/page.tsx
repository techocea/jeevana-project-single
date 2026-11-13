import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {
    getUserProfile,
} from "@/app/actions/profile-actions";
import {Label} from "@/components/ui/label";
import {getProfileStatusBadge} from "@/helpers/get-status-badge";
import Breadcrumbs from "@/components/dashboard/breadcrumbs";
import NicVerificationBanner from "@/components/dashboard/nic-verification-banner";
import {createClient} from "@/utils/supabase";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const ViewProfilePage = async ({params}: PageProps) => {
    const {profileId} = await params;
    const result = await getUserProfile(profileId);

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-20">
                <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">
                        Profile unavailable
                    </h2>
                    <p className="mt-4 text-muted">
                        We could not locate the profile. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    const profile = result.data;
    console.log("profile data with verifications:", profile);
    const verification = profile.verification;
    const supabase = await createClient();


    const profileImage = profile.profilePic || "/images/demo-profile-pic.png";
    const hobbies = Array.isArray(profile.hobbies)
        ? profile.hobbies.join(", ")
        : profile.hobbies || "Not specified";


    let frontSignedUrl: string | null = null;
    let backSignedUrl: string | null = null;

    if (verification?.documentFrontUrl) {
        const {data} = await supabase.storage
            .from("nic_documents")
            .createSignedUrl(verification.documentFrontUrl, 3600);
        frontSignedUrl = data?.signedUrl || null;
    }

    if (verification?.documentBackUrl) {
        const {data} = await supabase.storage
            .from("nic_documents")
            .createSignedUrl(verification.documentBackUrl, 3600);
        backSignedUrl = data?.signedUrl || null;
    }

    return (
        <main>
            <div className="mx-auto max-w-6xl space-y-3">
                <Breadcrumbs primaryText="Control Panel" primaryLink="control-panel" secondaryText="Approval Queue"
                             secondaryLink="approval-queues" currentPath={profile.profileID}/>
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className="overflow-hidden rounded-sm bg-slate-100">
                                    <Image
                                        src={profileImage}
                                        alt={profile.fullName || "Profile image"}
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-100 text-blue-400 border border-blue-400">
                                            {profile.profileID}
                                        </Badge>
                                        {getProfileStatusBadge(profile.status)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-950">
                                            {profile.fullName || "User"}
                                        </h2>
                                        <p className="flex items-center gap-1 text-sm text-muted">
                                            {profile.city || "Location not set"},{" "}
                                            {profile.country || "Country not set"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/*<ProfileActionsButtons profileId={profileId} status={profile.status}/>*/}
                        </div>
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Basic Information
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Full Name", profile.fullName)}
                        {renderField("Created By", profile.createdBy)}
                        {renderField("Contact", profile.contact)}
                        {renderField("Gender", profile.gender)}
                        {renderField(
                            "Date of Birth",
                            profile.dob
                                ? new Date(profile.dob).toLocaleDateString("en-GB")
                                : "Not specified",
                        )}
                    </div>
                </div>

                {/* Religion Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">Religion</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Religion", profile.religion)}
                        {renderField("Caste", profile.caste)}
                        {renderField("Mother Tongue", profile.motherTongue)}
                    </div>
                </div>

                {/* Career Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Career & Education
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Education Level", profile.educationLevel)}
                        {renderField("Profession", profile.profession)}
                        {renderField("Annual Income Range", profile.annualIncomeRange)}
                    </div>
                </div>

                {/* Location Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">Location</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Country", profile.country)}
                        {renderField("State", profile.state)}
                        {renderField("City", profile.city)}
                        {renderField("Residency Status", profile.residencyStatus)}
                    </div>
                </div>

                {/* Personal Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Personal Details
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Height (cm)", profile.height)}
                        {renderField("Weight (kg)", profile.weight)}
                        {renderField("Age", profile.age)}
                        {renderField("Smoking Habits", profile.smoking)}
                        {renderField("Drinking Habits", profile.drinking)}
                        {renderField("Food Preferences", profile.foodPreferences)}
                        {renderField("Differently Abled", profile.isDifferentlyAbled)}
                    </div>
                    {profile.isDifferentlyAbled && profile.differentlyAbledDetails && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase text-muted">
                                Accessibility Details
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {profile.differentlyAbledDetails}
                            </p>
                        </div>
                    )}
                </div>

                {/* Partner Preferences Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Partner Preferences Details
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Partner Preferred Min Age", profile.partnerPreferences?.preferredMinAge)}
                        {renderField("Partner Preferred Max Age", profile.partnerPreferences?.preferredMaxAge)}
                        {renderField("Partner's Marriage Status Should be", profile.partnerPreferences?.preferredMaritalStatus)}
                        {renderField("Partner's Education Status Should be", profile.partnerPreferences?.preferredEducationLevels)}
                        {renderField("Partner's Job Status Should be", profile.partnerPreferences?.preferredProfessions)}
                        {renderField("Partner's Annual Income Should be", profile.partnerPreferences?.preferredAnnualIncomeRanges)}
                    </div>
                    {profile.isDifferentlyAbled && profile.differentlyAbledDetails && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase text-muted">
                                Accessibility Details
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {profile.differentlyAbledDetails}
                            </p>
                        </div>
                    )}
                </div>

                {/* Final Details Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Final Details
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Hobbies", hobbies)}
                        {renderField("Mail Routing Target", profile.mailRoutingTarget)}
                        {renderField("Secondary Email", profile.secondaryEmail)}
                        {renderField("Profile Status", profile.status)}
                    </div>
                    {profile.narrative && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase text-muted">
                                Narrative
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {profile.narrative}
                            </p>
                        </div>
                    )}
                </div>

                {verification && (
                    <NicVerificationBanner
                        isAdmin={true}
                        profileId={profile.id}
                        verificationId={verification.verificationId}
                        verificationStatus={verification.verificationStatus}
                        rejectionReason={verification.rejectionReason}
                        documentFrontUrl={frontSignedUrl}
                        documentBackUrl={backSignedUrl}
                    />
                )}
            </div>
        </main>
    );
};

const renderField = (
    label: string,
    value: string | string[] | number | boolean | null | undefined,
) => {
    let displayValue = "Not specified";
    if (value === null || value === undefined) {
        displayValue = "Not specified";
    } else if (typeof value === "boolean") {
        displayValue = value ? "Yes" : "No";
    } else {
        displayValue = String(value);
    }

    return (
        <div>
            <Label className="text-muted font-normal">{label}</Label>
            <p className="mt-2 text-sm font-regular text-black capitalize">
                {displayValue}
            </p>
        </div>
    );
};

export default ViewProfilePage;
