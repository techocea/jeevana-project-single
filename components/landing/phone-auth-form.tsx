"use client";

import {useState, useTransition} from "react";
import {sendPhoneOtp, verifyPhoneOtp} from "@/app/actions/auth-actions";
import {Button} from "@/components/ui/button"; // Replace with your button component
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";   // Replace with your input component

export default function PhoneAuthForm() {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Handles requesting the SMS from Vonage
    const handleRequestSms = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        const formData = new FormData(e.currentTarget);
        const phoneInput = formData.get("phoneNumber") as string;

        startTransition(async () => {
            const result = await sendPhoneOtp(formData);
            if (result.success) {
                setPhoneNumber(phoneInput);
                setStep("otp");
            } else {
                setErrorMsg(result.error || "Failed to send code.");
            }
        });
    };

    // Handles submitting the code to log in
    const handleVerifySms = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        startTransition(async () => {
            const result = await verifyPhoneOtp(phoneNumber, otpToken);
            if (result.success) {
                // Successfully authenticated!
                window.location.href = "/onboarding"; // Redirect to onboarding
            } else {
                setErrorMsg(result.error || "Invalid OTP code.");
            }
        });
    };

    return (
        <div className="flex flex-col">
            <div className="mb-6 flex flex-col items-start justify-center">
                <h3 className="text-2xl font-semibold text-black">{step === "phone" ? "Verify via Phone" : "Enter Verification Code"}</h3>
            </div>
            {errorMsg && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-4 text-center">
                    {errorMsg}
                </p>
            )}

            {step === "phone" ? (
                /* Phone Input Screen */
                <form onSubmit={handleRequestSms} className="space-y-4 w-full">
                    <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700 uppercase">Phone Number</Label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            placeholder="+94 77 123 4567"
                        />
                    </div>
                    <Button type="submit" disabled={isPending} size="lg"
                            variant="default"
                            className="w-full uppercase px-6 py-3">
                        {isPending ? "Sending SMS..." : "send OTP"}
                    </Button>
                </form>
            ) : (
                /* OTP Verification Screen */
                <form onSubmit={handleVerifySms} className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700 uppercase">
                            6-Digit Code sent to {phoneNumber}
                        </Label>
                        <Input
                            type="text"
                            maxLength={6}
                            value={otpToken}
                            onChange={(e) => setOtpToken(e.target.value)}
                            placeholder="123456"
                            required/>
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                    <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => setStep("phone")} className="w-full -mt-4"
                    >
                        Change Phone Number
                    </Button>
                </form>
            )}
        </div>
    );
}
