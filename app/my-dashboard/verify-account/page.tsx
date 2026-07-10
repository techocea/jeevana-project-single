import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { ArrowLeft, IdCard, Phone } from "lucide-react";

interface VerifyAccountPageProps {
    searchParams: Promise<{ mode?: string }>;
}

const VerifyAccountPage = async ({ searchParams }: VerifyAccountPageProps) => {
    const params = await searchParams;
    const mode =
        params.mode === "phone"
            ? "phone"
            : params.mode === "nic"
                ? "nic"
                : undefined;

    return (
        <main className="min-h-screen bg-linear-to-br from-transparent to-primary/45 p-4 lg:p-10">
            <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 text-black">
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.4em] text-primary">
                        Account verification
                    </p>
                    <h1 className="text-3xl font-semibold">Verify your account</h1>
                    <p className="max-w-2xl text-base text-muted-foreground">
                        Choose how you want to verify your profile. You can verify your phone
                        number or your NIC to unlock full account access.
                    </p>
                </div>

                {!mode ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Link href="/my-dashboard/verify-account?mode=phone" className="group">
                            <Card className="cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                                <CardHeader className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <CardTitle>Phone number verification</CardTitle>
                                        <CardDescription>
                                            Confirm your mobile number with an OTP and keep your account secure.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Verified phone numbers help us prevent fraud and ensure your
                                        matches can contact you safely.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-black">Start verification</span>
                                        <span className="text-primary">›</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/my-dashboard/verify-account?mode=nic" className="group">
                            <Card className="cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                                <CardHeader className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                                        <IdCard size={24} />
                                    </div>
                                    <div>
                                        <CardTitle>NIC verification</CardTitle>
                                        <CardDescription>
                                            Verify your national identity card to complete your profile approval.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        NIC verification adds an extra layer of trust for you and your
                                        potential matches.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-black">Start verification</span>
                                        <span className="text-secondary">›</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        {mode === "phone" ? <Phone size={24} /> : <IdCard size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {mode === "phone" ? "Phone number verification" : "NIC verification"}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {mode === "phone"
                                                ? "Verify your mobile number by entering the code we send you."
                                                : "Upload your NIC and submit it for verification approval."}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href="/my-dashboard/verify-account">Back</Link>
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm uppercase tracking-[0.3em] text-muted">Selected flow</p>
                                    <p className="mt-2 text-base text-slate-900">
                                        {mode === "phone"
                                            ? "Phone OTP verification"
                                            : "NIC identity verification"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm uppercase tracking-[0.3em] text-muted">Benefits</p>
                                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        <li>Faster profile approval</li>
                                        <li>Higher trust score</li>
                                        <li>Better match visibility</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="space-y-4">
                                {mode === "phone" ? (
                                    <>
                                        <p className="text-lg font-semibold">Verify your phone</p>
                                        <p className="text-sm text-muted-foreground">
                                            We’ll send a one-time code to your registered mobile number.
                                        </p>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-sm text-muted">Registered phone</p>
                                                <p className="mt-2 text-base font-medium text-slate-950">+94 77 123 4567</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-sm text-muted">Status</p>
                                                <p className="mt-2 text-base font-medium text-emerald-600">Not verified</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <Button className="w-full sm:w-auto">Send verification code</Button>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Enter OTP manually
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold">Verify your NIC</p>
                                        <p className="text-sm text-muted-foreground">
                                            Upload a clear photo of your NIC front and back.
                                        </p>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-sm text-muted">NIC number</p>
                                                <p className="mt-2 text-base font-medium text-slate-950">98 XX 1234567</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-sm text-muted">Status</p>
                                                <p className="mt-2 text-base font-medium text-amber-600">Pending upload</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <Button className="w-full sm:w-auto">Upload NIC document</Button>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                View requirements
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </section>
        </main>
    );
};

export default VerifyAccountPage;
