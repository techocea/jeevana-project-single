"use client";

import {useState} from "react";
import {authLoginSchema, type AuthLoginValues} from "@/lib/validation";
import {loginAdmin} from "@/app/actions/auth-actions";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Eye, Lock, EyeClosed, AlertCircle, RefreshCw} from "lucide-react";

const AdminLoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

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
        setShowPassword((prev) => !prev);
    }

    const onSubmit = async (data: AuthLoginValues) => {
        setServerError(null);

        try {
            const result = await loginAdmin(data);
            if (result?.error) {
                setServerError(result.error);
                return;
            }

            if (result?.success) {
                router.push("/control-panel");
                router.refresh();
            }
        } catch (error) {
            console.error("Auth submission error:", error);
            setServerError("Unable to login. Please try again.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-[#FAF8F5] py-10 px-4">
            <div className="w-full max-w-md bg-white rounded-lg border border-[#D6CDBC] shadow-md p-6 sm:p-8 space-y-6">
                {/* Brand Lockup */}
                <div className="text-center">
                    <div
                        className="w-12 h-12 rounded-full bg-[#1E1B18] text-[#FAF8F5] flex items-center justify-center mx-auto mb-3 border border-[#8E6516]">
                        <Lock className="w-6 h-6 text-[#C59B27]"/>
                    </div>
                    <span className="text-[11px] font-semibold text-[#8E6516] uppercase tracking-widest">
            Internal Operations Portal
          </span>
                    <h1 className="font-editorial text-2xl font-bold text-[#1F1B18] mt-1">
                        Jeevana Staff Moderation
                    </h1>
                    <p className="text-xs text-[#665D52] mt-0.5">
                        Strictly for authorized compliance officers and profile reviewers.
                    </p>
                </div>

                {serverError && (
                    <div
                        className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0"/>
                        <span>{serverError}</span>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"

                        >
                            Staff Corporate Email
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            placeholder="admin@jeevana.lk"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"

                        >
                            Corporate Password
                        </Label>
                        <div className="relative w-full">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="pr-10"
                                placeholder="********"
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
                            <p className="text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full uppercase"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin text-white"/>}
                        <span>{isSubmitting ? 'Authenticating Staff...' : 'Sign In to Operations Console'}</span>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginForm;
