"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderStatus } from "@/app/actions/get-order-status-action";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 10; // ~20 seconds before giving up and telling them to check back

type PageState = "polling" | "paid" | "pending_timeout" | "failed" | "error";

const PaymentSuccessContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");

    const [state, setState] = useState<PageState>("polling");
    const [packageName, setPackageName] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setState("error");
            return;
        }

        let cancelled = false;
        let attempts = 0;

        const poll = async () => {
            const result = await getOrderStatus(orderId);

            if (cancelled) return;

            if (!result.success || !result.data) {
                setState("error");
                return;
            }

            setPackageName(result.data.packageName);

            if (result.data.status === "paid") {
                setState("paid");
                return;
            }

            if (result.data.status === "failed" || result.data.status === "cancelled") {
                setState("failed");
                return;
            }

            attempts += 1;
            if (attempts >= MAX_POLLS) {
                setState("pending_timeout");
                return;
            }

            setTimeout(poll, POLL_INTERVAL_MS);
        };

        poll();

        return () => {
            cancelled = true;
        };
    }, [orderId]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center space-y-4">
                {state === "polling" && (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-secondary" />
                        <h2 className="text-xl font-semibold">Confirming your payment...</h2>
                        <p className="text-sm text-slate-500">This usually takes just a few seconds.</p>
                    </>
                )}

                {state === "paid" && (
                    <>
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                        <h2 className="text-xl font-semibold">Payment successful!</h2>
                        {packageName && <p className="text-sm text-slate-500">Your {packageName} plan is now active.</p>}
                        <Button onClick={() => router.push("/my-dashboard")} className="mt-2">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {state === "pending_timeout" && (
                    <>
                        <Loader2 className="h-10 w-10 mx-auto text-amber-500" />
                        <h2 className="text-xl font-semibold">Still confirming...</h2>
                        <p className="text-sm text-slate-500">
                            Your payment is taking longer than usual to confirm. Check your dashboard in a minute — no need to pay
                            again.
                        </p>
                        <Button variant="outline" onClick={() => router.push("/my-dashboard")} className="mt-2">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {(state === "failed" || state === "error") && (
                    <>
                        <XCircle className="h-12 w-12 mx-auto text-red-600" />
                        <h2 className="text-xl font-semibold">
                            {state === "failed" ? "Payment didn't go through" : "Something went wrong"}
                        </h2>
                        <p className="text-sm text-slate-500">No charge was completed. You can try again from the pricing page.</p>
                        <Button onClick={() => router.push("/pricing")} className="mt-2">
                            Back to Pricing
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

const PaymentSuccessPage = () => {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
};

export default PaymentSuccessPage;