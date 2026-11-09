"use client";

import {Button} from "../ui/button";
import TitleHeader from "./title-header";
import {ArrowRight, ChevronRight, ShieldCheck, User} from "lucide-react";
import {useRouter} from "next/navigation";
import Image from "next/image";

export function RecommendedCandidates({proposals}: any) {
    const router = useRouter();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <TitleHeader title={"Recommended Candidates"}
                             description={"Hand-picked profiles aligned with your partner preferences."}/>
                <Button
                    onClick={() => router.push('/best-proposals')}
                    variant={"link"}
                >
                    <span>View All ({proposals.length})</span>
                    <ChevronRight className="w-3.5 h-3.5"/>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.slice(0, 2).map((item) => (
                    <div
                        key={item.id}
                        className="p-4 rounded-lg border border-border bg-white flex items-start gap-3.5 hover:border-strong ransition-colors shadow-2xs"
                    >
                        <div
                            className="w-16 h-16 rounded-md bg-background border border-strong overflow-hidden shrink-0 flex items-center justify-center">
                            {item.photoVisible && item.photoUrl ? (
                                <Image
                                    src={item.photoUrl}
                                    alt={item.displayName}
                                    width={64}
                                    height={64}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-primary"/>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-muted-foreground truncate">
                    {item.displayName}
                  </span>
                                <span className="font-mono text-[10px] text-[#7A7065]">
                    {item.id}
                  </span>
                            </div>
                            <div className="text-[#665D52] mt-0.5">
                                {item.age} yrs · {item.occupation}
                            </div>
                            <div className="text-[#8C8375] truncate mt-0.5">
                                {item.location}
                            </div>
                            <div className="mt-2.5 -mb-2.5 flex items-center justify-between">
                                  <span className="text-[11px] text-[#15803D] font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3"/>
                                    <span>NIC Verified</span>
                                  </span>
                                <Button
                                    variant={"link"}
                                    type={"button"}
                                    onClick={() => router.push(`/my-dashboard/best-proposals/${item.id}`)}
                                    className="text-xs p-0 uppercase"
                                >
                                    <span>View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}