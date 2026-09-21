import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {ArrowLeft, IdCard, Phone} from "lucide-react";
import VerificationCardsGrid from "@/components/dashboard/verification-grids";
import VerificationProcess from "@/components/dashboard/verification-process";

interface VerifyAccountPageProps {
    searchParams: Promise<{ mode?: string }>;
}

const VerifyAccountPage = async ({searchParams}: VerifyAccountPageProps) => {
    const params = await searchParams;
    const mode: "phone" | "nic" | undefined =
        params.mode === "phone"
            ? "phone"
            : params.mode === "nic"
                ? "nic" : undefined;

    return (
        <main className="mx-auto w-full">
            <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 text-black">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Verify your account</h1>
                    <p className="max-w-2xl text-base text-muted-foreground">
                        Choose how you want to verify your profile. You can verify your phone
                        number or your NIC to unlock full account access.
                    </p>
                </div>

                {!mode ? (
                    <VerificationCardsGrid phoneVerified={false} nicStatus={"unverified"}/>
                ) : (
                    <VerificationProcess mode={mode}/>
                )}
            </section>
        </main>
    );
};

export default VerifyAccountPage;
