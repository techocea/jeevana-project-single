"use client";

import Image from "next/image";
import {
  Heart,
  MapPin,
  Briefcase,
  Ruler,
  Cake,
  Crown,
  Church,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { ProfileCardProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { convertCmToFeetInches } from "@/helpers/measurement-utils";
import Link from "next/link";
import { addProfileToFavorite } from "@/app/actions/profile-actions";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function ProfileCard({
  currentProfileId,
  profileCardData, routing,
}: ProfileCardProps) {
  const data = profileCardData || {};
  const {
    id: targetProfileId,
    fullName,
    profilePic,
    age,
    caste,
    religion,
    height,
    country,
    profession,
    educationLevel,
    isFavorited = false,
  } = data;

  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFavorited(profileCardData?.isFavorited ?? false);
  }, [profileCardData?.isFavorited]);

  const handleFavoriteClick = () => {
    if (!currentProfileId || !targetProfileId) return;

    setFavorited((prev) => !prev);

    startTransition(async () => {
      const result = await addProfileToFavorite(currentProfileId, profileCardData.id);

      if (!result.success) {
        setFavorited((prev) => !prev);
        toast.error("Failed to add profile to favorites. Please try again.");
      }else{
        toast.success("Profile added to favorites");
      }

    });
  };

  // const membershipLabel = paymentStatus === "PAID" ? "Elite" : "Verified";
  // const badgeVariant = paymentStatus === "PAID" ? "default" : "secondary";

  return (
    <Card className="flex flex-row w-full border-t-4 border-primary shadow-sm">
      <CardContent className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <Image
                src={profilePic || "/images/profile-1.png"}
                alt={`${fullName} profile picture`}
                fill
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              {/* <Badge variant={badgeVariant}>{membershipLabel}</Badge> */}
              <h4 className="text-xl font-newsreader text-black">{fullName}</h4>
              <span className="flex items-center gap-1 -mt-2 text-sm text-muted">
                <MapPin size={16} />
                {country}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              className={cn(
                "rounded-full transition-colors",
                favorited &&
                "text-red-500 border-red-200 bg-red-50 hover:bg-red-100",
              )}
              onClick={handleFavoriteClick}
            >
              <Heart size={18} className={cn(favorited && "fill-current")} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-2">
          {[
            { icon: Briefcase, label: "Profession:", value: profession },
            { icon: GraduationCap, label: "Education:", value: educationLevel },
            { icon: Cake, label: "Age:", value: age },
            { icon: Ruler, label: "Height:", value: height },
            { icon: Crown, label: "Caste:", value: caste },
            { icon: Church, label: "Religion:", value: religion },
          ].map((item, index, arr) => {
            const Icon = item.icon;
            const isFirstTwo = index < 2;
            const spanClass = isFirstTwo
              ? "col-span-2 md:col-span-2"
              : "col-span-1";
            return (
              <div key={index} className={`${spanClass} flex gap-2`}>
                <Icon size={24} />
                <span className="font-medium">{item.label}</span>
                <span className="text-muted">
                  {item.value === height
                    ? convertCmToFeetInches(item.value)?.formatted
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between w-full">
          <Link
            href={`/my-dashboard/${routing}/${targetProfileId}`}
            className="text-primary flex items-center gap-2"
          >
            View Profile <ChevronRight />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
