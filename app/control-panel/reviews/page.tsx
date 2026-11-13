import TitleHeader from "@/components/dashboard/title-header";
import {eq, and, desc} from "drizzle-orm";
import {profiles, users, verifications} from "@/drizzle/schema";
import {db} from "@/lib/db";
import {AdvertisementTable, columns} from "./columns";
import {GenderTypes, ProfileStatusTypes, VerificationStatusTypes} from "@/types";
import {approveProfile, deleteProfile, rejectProfile} from "@/app/actions/profile-actions";
import {DataTable} from "./data-table";
import ReviewTabs from "./review-tabs";
import {Separator} from "@/components/ui/separator";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ status?: string }>;
}

const ApprovalReviewsPage = async ({searchParams}: PageProps) => {
    const resolvedParams = await searchParams;
    const currentStatus = resolvedParams.status || "all";

    const filters =
        currentStatus !== "all"
            ? [eq(profiles.status, currentStatus as ProfileStatusTypes)]
            : [];

    const data = await db
        .select({
            id: profiles.id,
            profileId: profiles.profileID,
            fullName: profiles.fullName,
            city: profiles.city,
            gender: profiles.gender,
            email:users.email,
            country: profiles.country,
            dob: profiles.dob,
            status: profiles.status,
            createdAt: profiles.createdAt,
        })
        .from(profiles)
        .leftJoin(users, eq(profiles.userId, users.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(profiles.createdAt));

    console.log("data:", data);

    const sanitizedData: AdvertisementTable[] = (data ?? []).map((row) => ({
        id: row.id,
        profileId: row.profileId,
        fullName: row.fullName ?? "N/A",
        city: row.city ?? "N/A",
        country: row.country ?? "N/A",
        email: row.email ?? "N/A",
        dob: row.dob ?? null,
        gender: (row.gender ?? "") as GenderTypes,
        status: (row.status ?? "pending") as ProfileStatusTypes,
        createdAt: row.createdAt ? new Date(row.createdAt) : null,
    }));

    const handleApprove = async (profileId: string, verificationId?: string | null) => {
        "use server";
        if (verificationId) {
            await approveProfile(verificationId, profileId);
        }
    }

    const handleReject = async (profileId: string, verificationId?: string | null, reason?: string) => {
        "use server";
        if (verificationId) {
            await rejectProfile(verificationId, profileId, reason ?? "Rejected by admin.");
        }
    }

    const handleDelete = async (id: string) => {
        "use server";
        await deleteProfile(id);
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex items-end justify-between w-full">
                        <TitleHeader
                            isGreeting={false}
                            title="Advertisement Reviews"
                            description="Inspect submitted candidate advertisements, review pending edits, and record moderation decisions."
                        />
                      <span className={"text-xs text-muted-foreground"}>{data.length} advertisements shown</span>
                    </div>

                    <Separator/>

                    <div>
                        <DataTable
                            columns={columns}
                            data={sanitizedData}
                            meta={{
                                onApprove: handleApprove,
                                onReject: handleReject,
                                onDelete: handleDelete,
                            }}
                            toolbarFilters={
                                <ReviewTabs currentStatus={currentStatus} />
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalReviewsPage;