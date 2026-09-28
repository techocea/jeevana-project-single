"use client";

import Image from "next/image";
import {
    MapPin,
    Briefcase,
    GraduationCap,
    CheckCircle2, HeartPlus, Eye,
} from "lucide-react";
import {ProfileCardDataProps} from "@/types";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "../ui/card";
import {convertCmToFeetInches} from "@/helpers/measurement-utils";
import toast from "react-hot-toast";

export function ProfileCard({
                               profileCardData
                            }: ProfileCardDataProps) {

    const data = profileCardData || {};

    const {
        id,
        fullName,
        profilePic,
        age,
        maritalStatus,
        foodPreferences,
        religion,
        height,
        country,
        profession,
        educationLevel,
        isVerified,
    } = data;

    const heightStr = convertCmToFeetInches(height).formatted;

    return (
        <Card
            className="bg-white py-0 rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 justify-between group">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={profilePic || "/images/profile-placeholder.png"} // Update with your actual placeholder path
                    alt={`${fullName} profile picture`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>

                {/* Badges */}
                <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-md shadow-sm">
                    <CheckCircle2 className="w-3 h-3"/> Verified ID
                </div>

                <span
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-stone-800 text-[10px] font-bold backdrop-blur-md shadow-sm">
            {age} Yrs • {heightStr}
          </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-bold leading-tight">{fullName}</h3>
                    <p className="text-xs text-stone-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400"/> {country}
                    </p>
                </div>
            </div>
            <CardContent className="pb-4 px-2 space-y-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-primary shrink-0"/>
                    <span className="font-medium text-stone-800 truncate">
              {profession}
            </span>
                </div>
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4.5 h-4.5 text-primary shrink-0"/>
                    <span className="truncate">{educationLevel}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
              {foodPreferences}
            </span>
                    <span className="text-stone-500">{maritalStatus}</span>
                </div>
                {/* Optional: Display religion to confirm community matching visually */}
                <div className="text-[10px] text-stone-400">Community: {religion}</div>

                <div className="pt-0 grid grid-cols-2 gap-2">
                    <Button
                        size="lg"
                        variant="default"
                    >
                        <HeartPlus className="w-3.5 h-3.5"/>
                        Send Interest
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                    >
                        <Eye className="w-3.5 h-3.5"/> View Profile
                    </Button>

                </div>
            </CardContent>
        </Card>
    );
}
