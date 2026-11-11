"use client";

import {useState} from "react";
import {authLoginSchema, type AuthLoginValues} from "@/lib/validation";
import {loginUser} from "@/app/actions/auth-actions";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Eye, EyeClosed, AlertCircle} from "lucide-react";

const LoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<AuthLoginValues>({
        resolver: zodResolver(authLoginSchema as any),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    }

    const onSubmit = async (data: AuthLoginValues) => {
        setErrorMessage(null);

        try {
            const result = await loginUser(data);
            if (result?.error) {
                setErrorMessage(result.error);
                return;
            }

            if (result?.success) {
                router.push(result.targetRoute || "/my-dashboard");
                router.refresh();
            }
        } catch (error) {
            console.error("Auth submission error:", error);
            setErrorMessage("Unable to login. Please try again.");
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-6 flex flex-col items-start justify-center">
                <h1 className="text-3xl font-semibold text-black">Sign in to Jeevana</h1>
                <p className="text-xs text-muted-foreground/75 mt-1">
                    Access your proposal portfolio, review requests, and pending invitations.
                </p>
            </div>

            {errorMessage && (
                <div
                    className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0"/>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <Label
                        htmlFor="email"
                    >
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="text"
                        placeholder="john@example.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between -mb-2">
                        <Label
                            htmlFor="password"
                        >
                            Password
                        </Label>
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => router.push('/auth?mode=forgot-password')}
                            className="text-xs"
                        >
                            Forgot password?
                        </Button>
                    </div>
                    <div className="relative w-full">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className="pr-10"
                            placeholder="Enter your password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleTogglePassword}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-fit w-fit p-1 bg-transparent hover:bg-transparent"
                        >
                            {!showPassword ? <Eye className="text-muted-foreground"/> :
                                <EyeClosed className="text-muted-foreground"/>}
                        </Button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    className="w-full uppercase tracking-wider"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Please wait..." : "Sign in"}
                </Button>
            </form>

            {/* Social Logins */}
            <div className="mt-6">
                <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-[#E8E2D7] w-full" />
                    <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#8C8375] absolute">
                    or connect with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setErrorMessage('Google SSO is disabled in demo mode. Please use email/password.')}
                        className="flex items-center justify-center gap-2 px-3 py-2 border border-[#D6CDBC] rounded-md text-xs font-medium text-[#554D45] hover:bg-[#F9F6F0] transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setErrorMessage('Facebook login is disabled in demo mode.')}
                        className="flex items-center justify-center gap-2 px-3 py-2 border border-[#D6CDBC] rounded-md text-xs font-medium text-[#554D45] hover:bg-[#F9F6F0] transition-colors"
                    >
                        <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                <div className="mt-6 text-center text-xs text-[#665D52]">
                    New to Jeevana?
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => router.push('/auth?mode=register')}
                        className="text-xs"
                    >
                        Create an account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
