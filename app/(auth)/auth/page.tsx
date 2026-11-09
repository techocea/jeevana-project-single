import {Lock, ShieldCheck} from "lucide-react";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";

interface AuthPageProps {
    searchParams: Promise<{ mode?: string }>;
}

const AuthPage = async ({searchParams}: AuthPageProps) => {
    const params = await searchParams;
    const mode = params.mode === "login"
        ? "login"
        : params.mode === "phone-number"
            ? "phone-number"
            : "register";

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-stretch justify-center bg-[#FAF8F5] py-6 px-4 sm:px-6">
            <div
                className="w-full max-w-4xl bg-white rounded-lg border border-[#E8E2D7] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                <div
                    className="lg:col-span-5 bg-[#241F1A] text-[#FAF8F5] p-8 sm:p-10 hidden md:flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#3D352D]">
                    {/* Subtle gold geometry background pattern */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:16px_16px]"/>

                    <div className="relative z-10">
                        <h2 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#FAF8F5] leading-snug mb-3">
                            Dignified Matrimony Founded on Trust & Lineage
                        </h2>
                        <p className="text-xs text-[#B8AE9D] leading-relaxed">
                            Sri Lanka&apos;s trusted matrimonial registry for discerning families. Verified credentials,
                            protected personal contacts, and courteous service.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-[#3D352D] space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-[#D8D0C2]">
                            <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"/>
                            <span>Strict identity and advertisement review by our professional staff before publication.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-[#D8D0C2]">
                            <Lock className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"/>
                            <span>Your phone, email, and NIC documents are never visible to the public.</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                    {mode === "login" ? <LoginForm/> : <RegisterForm/>}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
