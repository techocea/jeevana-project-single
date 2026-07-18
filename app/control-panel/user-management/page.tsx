import { DataTable } from "./data-table";
import TitleHeader from "@/components/dashboard/title-header";
import { db } from "@/lib/db";
import { eq, and, desc, ne } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import { columns } from "./columns";
import {
  flagUser,
  reactivateUser,
  suspendUser,
} from "@/app/actions/users-actions";
import UserManagementTabs from "./user-management-tabs";
import { UserStatusTypes } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const UserManagementPage = async ({ searchParams }: PageProps) => {
  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams.status || "all";

  const filters = [ne(users.role, "ADMIN")];

  if (currentStatus !== "all") {
    filters.push(eq(users.status, currentStatus as UserStatusTypes));
  }

  const data = await db
    .select({
      userId: users.id,
      fullName: users.fullName,
      email: users.email,
      status: users.status,
      membership: users.membership,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(...filters))
    .orderBy(desc(users.createdAt));

  const sanitizedData = (data ?? []).map((row) => ({
    ...row,
    status: (row.status ?? "active") as UserStatusTypes,
  }));

  if (!sanitizedData) {
    return (
      <div className="p-6 text-red-500">Error loading data from database.</div>
    );
  }

  const handleUserFlag = async (id: string) => {
    "use server";
    await flagUser(id);
  };

  const handleUserSuspend = async (id: string) => {
    "use server";
    await suspendUser(id);
  };

  const handleUserReactivate = async (id: string) => {
    "use server";
    await reactivateUser(id);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center justify-between w-full">
            <TitleHeader
              isGreeting={false}
              title="user directory"
              description="Manage Jeevana`s global community of seekers."
            />
            <UserManagementTabs currentStatus={currentStatus} />
          </div>

          <div>
            <DataTable
              columns={columns}
              data={sanitizedData}
              meta={{
                onUserFlag: handleUserFlag,
                onUserSuspend: handleUserSuspend,
                onUserReactivate: handleUserReactivate,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
