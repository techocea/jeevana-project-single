import TitleHeader from "@/components/dashboard/title-header";
import {eq, and, desc} from "drizzle-orm";
import {profiles, users, verifications} from "@/drizzle/schema";
import {db} from "@/lib/db";
import {AdvertisementTable, columns} from "./columns";
import {ProfileStatusTypes, VerificationStatusTypes} from "@/types";
import {approveProfile, deleteProfile, rejectProfile} from "@/app/actions/profile-actions";
import {DataTable} from "./data-table";
import ApprovalQueueTabs from "./approval-queue-tabs";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ status?: string }>;
}

const ApprovalQueuePage = async ({searchParams}: PageProps) => {
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
            religion: profiles.religion,
            caste: profiles.caste,
            email: users.email,
            status: profiles.status,
            isVerified: profiles.isVerified,
            createdAt: profiles.createdAt,

            verificationId: verifications.id,
            idNumber: verifications.idNumber,
            documentFrontUrl: verifications.documentFrontUrl,
            documentBackUrl: verifications.documentBackUrl,
            verificationStatus: verifications.status,
            rejectionReason: verifications.rejectionReason,
        })
        .from(profiles)
        .leftJoin(users, eq(profiles.userId, users.id))
        .leftJoin(verifications, eq(profiles.id, verifications.profileId))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(profiles.createdAt));

    const sanitizedData: AdvertisementTable[] = (data ?? []).map((row) => ({
        id: row.id,
        profileId: row.profileId,
        fullName: row.fullName ?? "N/A",
        religion: row.religion ?? "N/A",
        caste: row.caste ?? "N/A",
        email: row.email ?? "N/A",
        createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
        status: (row.status ?? "pending") as ProfileStatusTypes,
        isVerified: row.isVerified ?? false,
        idNumber: row.idNumber ?? null,
        verificationStatus: (row.verificationStatus ?? null) as VerificationStatusTypes | null,
        verificationId: row.verificationId ?? null,
        documentFrontUrl: row.documentFrontUrl ?? null,
        documentBackUrl: row.documentBackUrl ?? null,
        rejectionReason: row.rejectionReason ?? null,
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
                    <div className="flex items-center justify-between w-full">
                        <TitleHeader
                            isGreeting={false}
                            title="advertisement hub"
                            description="Review and manage matrimonial advertisement listings"
                        />
                        <ApprovalQueueTabs currentStatus={currentStatus}/>
                    </div>

                    <div>
                        <DataTable
                            columns={columns}
                            data={sanitizedData}
                            meta={{
                                onApprove: handleApprove,
                                onReject: handleReject,
                                onDelete: handleDelete,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalQueuePage;