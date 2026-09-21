import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Phone, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Clock} from "lucide-react";
import {getNicStatusBadge} from "@/helpers/get-status-badge";

interface VerificationCardsGridProps {
    phoneVerified: boolean;
    nicStatus: "unverified" | "pending" | "approved" | "rejected";
}

export default function VerificationCardsGrid({phoneVerified, nicStatus}: VerificationCardsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
                <Link href="/my-dashboard/verify-account?mode=phone" className="block">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Verify Phone Number
                                </h4>
                                {phoneVerified ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" /> Not Verified
                  </span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                    </CardContent>
                </Link>
            </Card>

            <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
                <Link href="/my-dashboard/verify-account?mode=nic" className="block">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Verify NIC Details
                                </h4>
                                {getNicStatusBadge(nicStatus)}
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                    </CardContent>
                </Link>
            </Card>
        </div>
    )
}

