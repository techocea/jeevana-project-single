import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ONBOARDING_HIGHLIGHTS} from "@/lib/constants";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import PhoneAuthForm from "@/components/landing/phone-auth-form";

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
        <main className="w-full">
            <section className="md:-mt-10 py-10 px-6 lg:py-20 lg:px-0">
                <div className="md:max-w-5xl mx-auto flex flex-col items-start gap-8">
                    <div>
                        <Button
                            variant="link"
                            className="uppercase text-lg font-regular flex items-center justify-center gap-2"
                            asChild
                        >
                            <Link href="/" className="flex items-center gap-2">
                <span>
                  <ArrowLeft/>
                </span>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row shadow-2xl w-full">
                        <div className="flex-1 flex flex-col p-8 items-center justify-center">
                            <div className="max-w-sm w-full">
                                {mode === "login" && <LoginForm/>}
                                {mode === "register" && <RegisterForm/>}
                                {mode === "phone-number" && <PhoneAuthForm/>}
                                <div className="mt-4 text-center w-full">
                                    {mode === "login" && (
                                        <>
                                            <Link href="/auth?mode=phone-number"
                                                  className="text-neutral-500 hover:text-neutral-800 transition-colors text-xs underline">
                                                Login with OTP
                                            </Link>
                                            <div className="text-neutral-300 text-xs my-1">or</div>
                                            <Button variant={"outline"} className="w-full" asChild>
                                                <Link href="/auth?mode=register"
                                                      className="text-primary hover:text-secondary font-medium transition-colors">
                                                    Don&apos;t have an account? Sign up
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                    {mode === "register" && (
                                        <>
                                            <Link href="/auth?mode=phone-number"
                                                  className="text-neutral-500 hover:text-neutral-800 transition-colors text-xs underline">
                                                Login with OTP
                                            </Link>
                                            <div className="text-neutral-300 text-xs my-1">or</div>
                                            <Button variant={"outline"} className="w-full" asChild>
                                                <Link href="/auth?mode=login"
                                                      className="text-primary hover:text-secondary font-medium transition-colors">
                                                    Already have an account? Log in
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                    {mode === "phone-number" && (
                                        <>
                                            <Link href="/auth?mode=login"
                                                  className="text-neutral-500 hover:text-neutral-800 transition-colors text-xs underline">
                                               Login with Email
                                            </Link>
                                            <div className="text-neutral-300 text-xs my-1">or</div>
                                            <Button variant={"outline"} className="w-full" asChild>
                                                <Link href="/auth?mode=register"
                                                      className="text-primary hover:text-secondary font-medium transition-colors">
                                                    Don&apos;t have an account? Sign up
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex md:flex-col flex-1 bg-linear-to-tr from-primary/10 to-primary/20">
                            {ONBOARDING_HIGHLIGHTS.map((highlight) => (
                                <div
                                    key={highlight.title}
                                    className="p-3 md:p-5 flex items-center gap-4"
                                >
                                    <div
                                        className="flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-white text-primary overflow-hidden">
                                        <highlight.icon className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-black">
                                            {highlight.title}
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {highlight.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AuthPage;
