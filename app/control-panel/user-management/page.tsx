import {DataTable} from "./data-table";
import TitleHeader from "@/components/dashboard/title-header";
import {db} from "@/lib/db";
import {eq, and, desc, ne} from "drizzle-orm";
import {users} from "@/drizzle/schema";
import {columns} from "./columns";
import {banUser, reactivateUser} from "@/app/actions/users-actions";
import UserManagementTabs from "./user-management-tabs";
import {MembershipTypes, UserStatusTypes} from "@/types";
import CreateUser from "@/components/dashboard/create-user";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ status?: string }>;
}

const UserManagementPage = async ({searchParams}: PageProps) => {
    const resolvedParams = await searchParams;
    const currentStatus = resolvedParams.status || "all";

    const filters = [ne(users.role, "admin")];

    if (currentStatus !== "all") {
        filters.push(eq(users.status, currentStatus as UserStatusTypes));
    }

    const data = await db
        .select({
            id: users.id,
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
        membership: (row.membership ?? "free_tier") as MembershipTypes
    }));

    if (!sanitizedData) {
        return (
            <div className="p-6 text-red-500">Error loading data from database.</div>
        );
    }

    const handleUserBan = async (id: string) => {
        "use server";
        await banUser(id);
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
                        <CreateUser/>
                    </div>

                    <DataTable
                        columns={columns}
                        currentStatus={currentStatus}
                        data={sanitizedData}
                        meta={{
                            onBan: handleUserBan,
                            onReactivate: handleUserReactivate,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;
