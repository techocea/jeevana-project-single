import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {getMatchedProfile} from "@/app/actions/profile-actions";
import {Label} from "@/components/ui/label";
import {getProfileStatusBadge} from "@/helpers/get-status-badge";
// import {ProfileActionsButtons} from "@/components/dashboard/profile-actions-buttons";
import Breadcrumbs from "@/components/dashboard/breadcrumbs";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const ViewProfilePage = async ({params}: PageProps) => {
    const {profileId} = await params;

    const result = await getMatchedProfile(profileId);

    const matchedProfile = result.data?.profile;


    if (!matchedProfile) {
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

    console.log("Matched Profile details:", matchedProfile);

    const profileImage = matchedProfile.profilePic || "/images/demo-profile-pic.png";
    const hobbies = Array.isArray(matchedProfile.hobbies)
        ? matchedProfile.hobbies.join(", ")
        : matchedProfile.hobbies || "Not specified";

    return (
        <main className="space-y-4">
            <Breadcrumbs primaryText="My Dashboard" primaryLink="my-dashboard" secondaryText="Best Proposals"
                         secondaryLink="best-proposals" currentPath={matchedProfile.profileID}/>
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className="overflow-hidden rounded-sm bg-slate-100">
                                    <Image
                                        src={profileImage}
                                        alt={matchedProfile.fullName || "Profile image"}
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-100 text-blue-400 border border-blue-400">
                                            {matchedProfile.profileID}
                                        </Badge>
                                        {getProfileStatusBadge(matchedProfile.status)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-950">
                                            {matchedProfile.fullName || "User"}
                                        </h2>
                                        <p className="flex items-center gap-1 text-sm text-muted">
                                            {matchedProfile.city || "Location not set"},{" "}
                                            {matchedProfile.country || "Country not set"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/*<ProfileActionsButtons profileId={profileId} status={matchedProfile.status}/>*/}
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
                        {renderField("Full Name", matchedProfile.fullName)}
                        {renderField("Created By", matchedProfile.createdBy)}
                        {renderField("Contact", matchedProfile.contact)}
                        {renderField("Gender", matchedProfile.gender)}
                        {renderField(
                            "Date of Birth",
                            matchedProfile.dob
                                ? new Date(matchedProfile.dob).toLocaleDateString("en-GB")
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
                        {renderField("Religion", matchedProfile.religion)}
                        {renderField("Caste", matchedProfile.caste)}
                        {renderField("Mother Tongue", matchedProfile.motherTongue)}
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
                        {renderField("Education Level", matchedProfile.educationLevel)}
                        {renderField("Profession", matchedProfile.profession)}
                        {renderField("Annual Income Range", matchedProfile.annualIncomeRange)}
                    </div>
                </div>

                {/* Location Section */}
                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 pb-4 flex items-center justify-between border-b border-muted-foreground/50">
                        <h2 className="text-lg font-semibold text-slate-950">Location</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderField("Country", matchedProfile.country)}
                        {renderField("State", matchedProfile.state)}
                        {renderField("City", matchedProfile.city)}
                        {renderField("Residency Status", matchedProfile.residencyStatus)}
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
                        {renderField("Height (cm)", matchedProfile.height)}
                        {renderField("Weight (kg)", matchedProfile.weight)}
                        {renderField("Age", matchedProfile.age)}
                        {renderField("Smoking Habits", matchedProfile.smoking)}
                        {renderField("Drinking Habits", matchedProfile.drinking)}
                        {renderField("Food Preferences", matchedProfile.foodPreferences)}
                        {renderField("Differently Abled", matchedProfile.isDifferentlyAbled)}
                    </div>
                    {matchedProfile.isDifferentlyAbled && matchedProfile.differentlyAbledDetails && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase text-muted">
                                Accessibility Details
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {matchedProfile.differentlyAbledDetails}
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
                        {renderField("Mail Routing Target", matchedProfile.mailRoutingTarget)}
                        {renderField("Secondary Email", matchedProfile.secondaryEmail)}
                        {renderField("matchedProfile Status", matchedProfile.status)}
                    </div>
                    {matchedProfile.narrative && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase text-muted">
                                Narrative
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {matchedProfile.narrative}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const renderField = (
    label: string,
    value: string | number | boolean | null | undefined,
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
