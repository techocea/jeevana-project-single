import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {
    getUserProfile,
} from "@/app/actions/profile-actions";
import {Label} from "@/components/ui/label";
import {getProfileStatusBadge} from "@/helpers/get-status-badge";
import Breadcrumbs from "@/components/dashboard/breadcrumbs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {createClient} from "@/utils/supabase";
import TitleHeader from "@/components/dashboard/title-header";
import {Separator} from "@/components/ui/separator";
import {
    MapPin,
    Briefcase,
    GraduationCap,
    Users,
    Heart,
    Lock, AlertCircle,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {convertCmToFeetInches} from "@/helpers/measurement-utils";
import {getAccurateAge} from "@/helpers/format-date";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const ViewProfilePage = async ({params}: PageProps) => {
    const {profileId} = await params;
    const result = await getUserProfile(profileId);

    if (!result.success || !result.data) {
        return (
            <div className="bg-white p-8 rounded-lg border border-[#FCA5A5] text-center shadow-2xs">
                <div
                    className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6"/>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-[#1F1B18]">
                    Unable to Load Candidate Registry
                </h3>
                <p className="text-xs text-[#554D45] max-w-md mx-auto mt-1">
                    A temporary connection issue prevented loading the matchmaking directory. Please check your network
                    connection and retry.
                </p>
                <Button>
                    Retry
                </Button>
            </div>
        );
    }

    const profile = result.data;
    console.log("profile data:", profile);

    const displayName = profile.fullName;
    const profileImage = profile.profilePic || "/images/demo-profile-pic.png";
    const submittedAt = profile.updatedAt.toISOString().split("T")[0];
    const parsedDOB = profile.dob ? profile.dob.toISOString().split("T")[0] : null;
    const age = parsedDOB
        ? getAccurateAge(parsedDOB)
        : null;
    const heightStr = convertCmToFeetInches(profile.height).formatted;
    const city = profile.city;
    const country = profile.country;
    const location = `${city},${country}`;

    return (
        <div className="space-y-4">
            <Breadcrumbs primaryText="Control Panel" primaryLink="control-panel" secondaryText="Profile Reviews"
                         secondaryLink="reviews" currentPath={profile.profileID}/>
            <div className="flex items-end justify-between w-full">
                <TitleHeader
                    title={`${displayName}`}
                    description="Editorial inspection for compliance with community modesty and privacy standards."
                />
                <div>
                    {/*ADD BUTTONS HERE*/}
                </div>
            </div>

            <Separator/>

            {/* Section 1: Profile Summary */}
            <Card>
                <CardHeader className="pb-3 border-b border-[#E8E2D7]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-base">Profile Summary</CardTitle>
                            <CardDescription>
                                Publicly visible advertisement overview (private contact &amp; NIC details excluded).
                            </CardDescription>
                        </div>
                        <span
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#635A50] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E8E2D7]">
                <Lock className="w-3 h-3 text-primary"/>
                <span>
                  Photo:{'Visible to Members'}
                    {/*  <strong className="text-[#1E1B18]">*/}
                    {/*  {(*/}
                    {/*      isPrimaryMember*/}
                    {/*          ? profile.partnerPreferences.photoVisible*/}
                    {/*          : profile.proposal.photoVisible*/}
                    {/*  )*/}
                    {/*      ? 'Visible to Members'*/}
                    {/*      : 'Hidden (Privacy Mode)'}*/}
                    {/*</strong>*/}
                </span>
              </span>
                    </div>
                </CardHeader>
                <CardContent className="">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Public Display Name</dt>
                            <dd className="font-semibold text-[#1E1B18]">
                                {profile.fullName}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Age &amp; Height</dt>
                            <dd className="font-semibold text-[#1E1B18] tabular-numbers">
                                {age} yrs · {heightStr}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Marital Status</dt>
                            <dd className="font-semibold text-[#1E1B18] capitalize">
                                {profile.maritalStatus && (profile.maritalStatus).replace('_', ' ')}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Religion &amp; Background</dt>
                            <dd className="font-semibold text-[#1E1B18]">
                                {`${profile.religion} · ${profile.caste}`}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Location</dt>
                            <dd className="font-semibold text-[#1E1B18] inline-flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0"/>
                                <span>{location}</span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[#635A50] mb-0.5">Submitted / Registered</dt>
                            <dd className="font-semibold text-[#1E1B18] tabular-numbers">
                                {submittedAt}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {/* Section 2: About Me & Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-3 border-b border-[#E8E2D7]">
                        <CardTitle className="text-base inline-flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary"/>
                            <span>Education &amp; Career</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className=" text-xs space-y-2.5">
                        <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                            <span className="text-[#635A50]">Qualification</span>
                            <span className="font-medium text-[#1E1B18] text-right">
                  {profile.educationLevel}
                </span>
                        </div>

                        <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                            <span className="text-[#635A50]">Institution</span>
                            <span className="font-medium text-[#1E1B18] text-right">
                    {profile.educationDescription}
                  </span>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                            <span className="text-[#635A50]">Occupation</span>
                            <span className="font-medium text-[#1E1B18] text-right inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary shrink-0"/>
                  <span>{profile.profession}</span>
                </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-[#635A50]">Employment Sector</span>
                            <span className="font-medium text-[#1E1B18] text-right">
                            {profile.employedIn}
                                </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3 border-b border-[#E8E2D7]">
                        <CardTitle className="text-base">Narrative Inspection (&ldquo;About Me&rdquo;)</CardTitle>
                    </CardHeader>
                    <CardContent className="italic">
                        &ldquo;
                        {profile.narrative}
                        &rdquo;
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: About Me & Partner Preferences */}
            <div className="grid grid-cols-1  gap-6">
                <Card>
                    <CardHeader className="pb-3 border-b border-[#E8E2D7]">
                        <CardTitle className="text-base inline-flex items-center gap-2">
                            <Heart className="w-4 h-4 text-primary" />
                            <span>Partner Preferences</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs space-y-2.5">
                        {profile.partnerPreferences && (
                            <>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50]">Age &amp; Height Range</span>
                                    <span className="font-medium text-[#1E1B18] text-right tabular-numbers">
                      {profile.partnerPreferences.preferredMinAge}–{profile.partnerPreferences.preferredMaxAge} yrs ·{' '}
                                        {profile.partnerPreferences.preferredMinHeight} to {profile.partnerPreferences.preferredMaxHeight}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50]">Education</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredEducationLevels?.join(', ')}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Religions</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredReligions?.join(', ')}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Professions</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredProfessions?.join(', ')}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Castes</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredCastes?.join(', ')}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Annual Income Range</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredAnnualIncomeRanges?.join(', ')}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Marital Status</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredMaritalStatuses?.toLocaleUpperCase()}
                    </span>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-[#F2ECE3] pb-2">
                                    <span className="text-[#635A50] block mb-1">Residency Status</span>
                                    <span className="font-medium text-[#1E1B18] text-right">
                      {profile.partnerPreferences.preferredResidencyStatuses?.join(', ')}
                    </span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ViewProfilePage;