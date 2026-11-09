"use client";

import {useState} from "react";
import {authRegisterSchema, type AuthRegisterValues} from "@/lib/validation";
import {registerUser} from "@/app/actions/auth-actions";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {AlertCircle, CheckCircle2, Eye, EyeClosed} from "lucide-react";
import Link from "next/link";

const RegisterForm = () => {
    const router = useRouter();
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<AuthRegisterValues>({
        resolver: zodResolver(authRegisterSchema as any),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    }

    const onSubmit = async (data: AuthRegisterValues) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!agreedTerms) {
            setErrorMessage('Please accept the Terms of Service & Privacy Policy to proceed.');
            return;
        }

        try {
            const result = await registerUser(data);
            if (result?.error) {
                setErrorMessage(result.error);
                return;
            }
            if (result?.success) {
                if (result.emailVerificationRequired) {
                    setSuccessMessage("Check your email inbox to confirm");
                } else {
                    router.push("/onboarding");
                    router.refresh();
                }
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred during signup.");
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-6 flex flex-col items-start justify-center">
                <h1 className="text-3xl font-semibold text-black">Register for Jeevana</h1>
                <p className="text-xs text-muted-foreground/75 mt-1">
                    Begin your matrimonial journey with a protected profile.
                </p>
            </div>

            {errorMessage && (
                <div
                    className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0"/>
                    <span>{errorMessage}</span>
                </div>
            )}

            {successMessage && (
                <div
                    className="p-4 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#15803D] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5"/>
                    <span>{successMessage}</span>
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                        <Label
                            htmlFor="fullName"

                        >
                            Candidate&apos;s Full Name
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            {...register("fullName")}
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>
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
                        <Label
                            htmlFor="contact"
                        >
                            Mobile Number <span className="text-xs text-muted-foreground/75">(For OTP)</span>
                        </Label>
                        <Input
                            id="contact"
                            type="text"
                            placeholder="+94 7X XXX XXXX"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                        <Label
                            htmlFor="password"
                        >
                            Create Password
                        </Label>
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
                            <p className="text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                {/* Terms acknowledgement checkbox */}
                <div className="pt-1">
                    <Label className="flex text-muted-foreground/75 leading-4 font-normal">
                        <input
                            type="checkbox"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-0.5 ounded border-[#D6CDBC] text-[#8E6516] focus:ring-[#8E6516]"
                        />
                        <span>
                            I certify this proposal is created with family consent and agree to the{' '}
                            <Link href={"/terms"} className="text-[#8E6516] underline">Terms of Service</Link> and{' '}
                            <Link href={"/privacy-policy"} className="text-[#8E6516] underline">Privacy Policy</Link>.
                        </span>
                    </Label>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    className="w-full uppercase tracking-wider"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Please wait..." : "Register Now"}
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;
