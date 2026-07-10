import { getCurrentUserProfile } from "@/app/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface PageProps {
    params: { profileId: string };
}

const ProfilePage = async ({ params: { profileId } }: PageProps) => {
    const result = await getCurrentUserProfile();

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-20">
                <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">
                        Profile unavailable
                    </h2>
                    <p className="mt-4 text-muted">
                        We could not locate your profile. Please complete your onboarding or
                        try again later.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <Card>
            <Button variant="link" className="flex items-center gap-2" asChild>
                <Link href={`/my-dashboard/my-profile/${result.data.id}`}>
                    View Profile
                </Link>
            </Button>
        </Card>
    );
};

export default ProfilePage;
