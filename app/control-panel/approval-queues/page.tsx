import TitleHeader from "@/components/dashboard/title-header";
import { eq, and, desc } from "drizzle-orm";
import { profiles, users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { columns } from "./columns";
import { ProfileStatusTypes } from "@/types";
import { approveProfile, rejectProfile } from "@/app/actions/profile-actions";
import { DataTable } from "./data-table";
import ApprovalQueueTabs from "./approval-queue-tabs";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const ApprovalQueuePage = async ({ searchParams }: PageProps) => {
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
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .leftJoin(users, eq(profiles.userId, users.id))
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(profiles.createdAt));

  const sanitizedData = (data ?? []).map((row) => ({
    ...row,
    status: (row.status ?? "pending") as ProfileStatusTypes,
  }));

  if (!sanitizedData) {
    return (
      <div className="p-6 text-red-500">Error loading data from database.</div>
    );
  }

  const handleApprove = async (id: string) => {
    "use server";
    await approveProfile(id);
  };

  const handleReject = async (id: string) => {
    "use server";
    await rejectProfile(id);
  };


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
            <ApprovalQueueTabs currentStatus={currentStatus} />
          </div>

          <div>
            <DataTable
              columns={columns}
              data={sanitizedData}
              meta={{
                onApprove: handleApprove,
                onReject: handleReject,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalQueuePage;
