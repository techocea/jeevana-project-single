import Image from "next/image";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    User,
    Eye,
    AlertCircle,
    CreditCard,
    Trash2,
    Shield
} from "lucide-react";

interface ProfileCardProps {
    id: string;
    profileId: string;
    status: "pending" | "approved" | "rejected";
    gender: string | null;
    avatarUrl?: string;
    paymentStatus?: {
        title: string;
        description: string;
        subtext: string;
        isRejected: boolean;
    };
    onDelete?: () => void;
}

export default function MyProfileCard({
                                          id = "sdfdsfsdfff",
                                          profileId = "USR-14663",
                                          status = "pending",
                                          gender = "Male",
                                          avatarUrl,
                                          paymentStatus = {
                                              title: "Payment Rejected",
                                              description: "Payment not received",
                                              subtext: "Please re-submit your payment to activate this profile.",
                                              isRejected: true,
                                          },
                                          onDelete,
                                      }: ProfileCardProps) {
    return (
        <Card
            className="w-full max-w-md overflow-hidden rounded-2xl bg-none shadow-sm transition-all hover:shadow-md pt-0">
            {/* Soft Pink Header Accent */}
            <div className="flex items-center justify-between bg-red-500/20 p-5">
                <div className="flex items-center gap-3">
                    <div
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rose-200/50 bg-white">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={profileId}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div
                                className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500 font-semibold text-xs">
                                {profileId.substring(0, 3)}
                            </div>
                        )}
                    </div>
                    <span className="text-base font-bold text-[var(--black)] tracking-tight">
            {profileId}
          </span>
                </div>

                <Badge
                    variant="secondary"
                    className="rounded-full bg-rose-100/70 px-3 py-0.5 text-xs font-semibold text-slate-600 dark:bg-rose-900/40 dark:text-rose-200"
                >
                    {status}
                </Badge>
            </div>

            <CardContent className="space-y-4 px-5">
                {/* Gender & View Profile Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <User className="h-4 w-4"/>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                GENDER
                            </p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {gender}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Rejected Alert Box */}
                {paymentStatus.isRejected && (
                    <div
                        className="rounded-xl border border-red-200/80 bg-red-50/50 p-3.5 dark:border-red-900/50 dark:bg-red-950/20">
                        <div className="flex items-start gap-2.5">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"/>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-red-700 dark:text-red-400">
                                    {paymentStatus.title}
                                </h4>
                                <p className="text-xs font-semibold text-red-600/90 dark:text-red-300">
                                    {paymentStatus.description}
                                </p>
                                <p className="pt-1 text-[11px] font-normal text-red-500 dark:text-red-400">
                                    {paymentStatus.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Actions Row 1 */}
                <div className="flex items-center gap-2 pt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className={"w-1/2"}
                        asChild
                    >
                        <Link href={`/my-dashboard/my-profile/${id}`}>
                            <Eye className="mr-1.5 h-3.5 w-3.5"/>
                            View Details
                        </Link>
                    </Button>
                    <Button
                        size="sm"
                        variant={"destructive"}
                        className="w-1/2"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5"/>
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}