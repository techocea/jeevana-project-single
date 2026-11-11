import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {getUserProfile} from "@/app/actions/profile-actions";
import {AlertCircle, CheckCircle2, Dot, EyeOff, Pen} from "lucide-react";
import {Label} from "@/components/ui/label";
import {getProfileStatusBadge} from "@/helpers/get-status-badge";
import TitleHeader from "@/components/dashboard/title-header";
import {Separator} from "@/components/ui/separator";
import {getAccurateAge} from "@/helpers/format-date";
import {convertCmToFeetInches} from "@/helpers/measurement-utils";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const ProfilePage = async ({params}: PageProps) => {
    const {profileId} = await params;
    const result = await getUserProfile(profileId);

    console.log("PROFILE VIEW PROFILE DATA:", result.data);

    if (!result.success || !result.data) {
        return (
            <div className="bg-white p-8 rounded-lg border border-[#FCA5A5] text-center shadow-2xs">
                <div
                    className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6"/>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-accent-foreground">
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
    const profileImage = profile.profilePic || "/images/demo-profile-pic.png";

    const submittedAt = profile.updatedAt.toISOString().split("T")[0];
    const parsedDOB = profile.dob ? profile.dob.toISOString().split("T")[0] : null;
    const heightStr = convertCmToFeetInches(profile.height).formatted;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
                <TitleHeader title={"My Matrimonial Profile & Advertisement"}
                             description={"Manage your verified advertisement, confidentiality settings, and review requests."}/>
                <Button size={"lg"}>
                    <Link href={`/my-dashboard/my-profile/${profileId}/edit`} className={"flex items-center gap-2"}>
                        <Pen/> <span>Edit Profile</span>
                    </Link>
                </Button>
            </div>

            <Separator/>

            <div className="bg-white rounded-lg border border-[#E8E2D7] shadow-sm overflow-hidden">
                <div
                    className="bg-[#FAF8F5] px-6 py-4 border-b border-strong flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
              <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#F2ECE3] text-[#554D45] rounded border border-[#E0D8CB]">
                ID: {profile.profileID}
              </span>
                        <span className="text-xs text-[#665D52]">
                Submitted: {submittedAt}
              </span>
                        <span className="text-[#8C8375]"><Dot/></span>
                        <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5"/>
                <span>Approved by Staff</span>
              </span>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Avatar Column */}
                        <div className="md:col-span-4 flex flex-col items-center">
                            <div
                                className="w-44 h-44 rounded-lg border border-[#E8E2D7] bg-[#FAF8F5] overflow-hidden flex items-center justify-center relative shadow-2xs">
                                {profile.photoVisible && profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={profile.fullName || "Profile image"}
                                        width={176}
                                        height={176}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="text-center p-4 text-[#7A7065]">
                                        <div
                                            className="w-12 h-12 rounded-full bg-[#EFE6D8] flex items-center justify-center mx-auto mb-2">
                                            <EyeOff className="w-6 h-6 text-[#8E6516]"/>
                                        </div>
                                        <div className="font-semibold text-xs text-accent-foreground">Photo Protected
                                        </div>
                                        <div className="text-[10px] text-[#8C8375] mt-1">
                                            Hidden from public/signed-in members.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 text-center">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                      profile.photoVisible
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#F2ECE3] text-[#665D52]'
                  }`}>
                    {profile.photoVisible ? 'Visible to Members' : 'Photo Kept Confidential'}
                  </span>
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div className="md:col-span-8 space-y-2">
                            {/* Basic Information Section */}
                            <div className="flex items-center justify-between pb-3">
                                <div>
                                    <h2 className="font-editorial text-2xl font-semibold text-accent-foreground">
                                        {profile.fullName}
                                    </h2>
                                    <div className="flex items-center gap-0.5 text-xs text-[#665D52] mt-0.5 capitalize">
                                        {getAccurateAge(parsedDOB)} yrs <Dot/> {heightStr}
                                        <Dot/> {profile.maritalStatus} <Dot/> {profile.religion} ({profile.caste})
                                    </div>
                                </div>

                                <div className="text-right text-xs">
                                    <div className="font-semibold text-accent-foreground">{profile.city || null}</div>
                                    <div className="text-[#8C8375]">{profile.state || null}</div>
                                </div>
                            </div>
                            <Separator/>
                            {/* Career & Education Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs py-3">
                                <div className={"space-y-2"}>
                                    <span className="text-[#8C8375] block font-medium">Education:</span>
                                    <span
                                        className="font-semibold text-accent-foreground">{profile.educationLevel}</span>
                                    <span
                                        className="text-[#665D52] block text-[11px]">{profile.educationDescription}</span>
                                </div>
                                <div className={"space-y-2"}>
                                    <span className="text-[#8C8375] block font-medium">Occupation:</span>
                                    <span className="font-semibold text-[#1F1B18]">{profile.profession}</span>
                                    <span
                                        className="text-[#665D52] block text-[11px]">{profile.employedIn} Sector <br/> {profile.annualIncomeRange}</span>
                                </div>
                                {/*<div className="space-y-2">*/}
                                {/*    <span className="text-[#8C8375] block font-medium">Family Heritage:</span>*/}
                                {/*    <span className="text-accent-foreground">{profile.familyValues} Values <Dot/> {profile.familyType} Family</span>*/}
                                {/*    <span className="text-[#665D52] block text-[11px]">Father: {profile.fatherOccupation}</span>*/}
                                {/*</div>*/}
                                {/*<div className="space-y-2">*/}
                                {/*    <span className="text-[#8C8375] block font-medium">Siblings & Roots:</span>*/}
                                {/*    <span className="text-accent-foreground">{profile.siblingsDetails}</span>*/}
                                {/*    <span className="text-[#665D52] block text-[11px]">Roots: {profile.familyLocation}</span>*/}
                                {/*</div>*/}
                            </div>
                            <Separator/>
                            {/* Personal Section */}
                            <div className="pt-3">
                                <span className="text-[#8C8375] block text-xs font-medium mb-1">About Me:</span>
                                <div
                                    className="bg-[#FAF8F5] p-3.5 rounded border border-[#F2ECE3]">
                                    <p className="text-xs text-[#4A423A] leading-relaxed">{profile.narrative}</p>
                                    <Separator className="my-3"/>
                                    {/* Lifestyle metadata */}
                                    <div
                                        className="flex flex-wrap items-center gap-1 text-[11px] text-[#665D52]">
                                        <span className="font-semibold text-[#1F1B18]">Lifestyle:</span>
                                        <span>Diet: <strong>{profile.foodPreferences}</strong></span>
                                        <span aria-hidden="true" className="text-[#8C8375]"><Dot /></span>
                                        <span>Smoking: <strong>{profile.smoking}</strong></span>
                                        <span aria-hidden="true" className="text-[#8C8375]"><Dot /></span>
                                        <span>Drinking: <strong>{profile.drinking}</strong></span>
                                        <span aria-hidden="true" className="text-[#8C8375]"><span className={"w-3 h-3"}><Dot className={"w-6 h-6"}/></span></span>
                                        <span>Mother Tongue: <strong>{profile.motherTongue}</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <span
                                    className="text-[#8C8375] block text-xs font-medium mb-1">Partner Expectations:</span>
                                <div
                                    className="text-xs text-[#4A423A] bg-[#FAF8F5] p-3.5 rounded border border-[#F2ECE3] leading-relaxed">
                                    <div className="space-y-2">
                                        <div
                                            className="text-[11px] font-semibold text-[#7A7065] uppercase tracking-wider">
                                            Key Matching Criteria:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Age chip */}
                                            <div
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">
                                                <span className="text-[#8C8375]">Age:</span>
                                                <span>{profile.partnerPreferences?.preferredMinAge} – {profile.partnerPreferences?.preferredMaxAge} yrs</span>
                                            </div>

                                            {/* Height chip */}
                                            <div
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">
                                                <span className="text-[#8C8375]">Height:</span>
                                                <span>{profile.partnerPreferences?.preferredMinHeight} – {profile.partnerPreferences?.preferredMaxHeight}</span>
                                            </div>

                                            {/* Religions */}
                                            {profile.partnerPreferences?.preferredReligions?.map((rel, idx) => (
                                                <div key={idx}
                                                     className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">
                                                    <span>{rel}</span>
                                                </div>
                                            ))}

                                            {/* Locations */}
                                            {/*{profile.partnerLocation.map((loc, idx) => (*/}
                                            {/*    <div key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">*/}
                                            {/*        <span>{loc}</span>*/}
                                            {/*    </div>*/}
                                            {/*))}*/}

                                            {/* Education */}
                                            {profile.partnerPreferences?.preferredEducationLevels?.map((edu, idx) => (
                                                <div key={idx}
                                                     className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">
                                                    <span>{edu}</span>
                                                </div>
                                            ))}

                                            {/* Professions */}
                                            {profile.partnerPreferences?.preferredProfessions?.map((prof, idx) => (
                                                <div key={idx}
                                                     className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-white border border-[#D6CDBC] text-[#1F1B18] font-medium shadow-2xs">
                                                    <span>{prof}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;