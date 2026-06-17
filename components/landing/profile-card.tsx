import Image from "next/image";
import {
  Heart,
  Star,
  Bookmark,
  MapPin,
  Briefcase,
  Ruler,
  Cake,
  Crown,
  Church,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfileCardProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { convertCmToFeetInches } from "@/helpers/measurement-utils";

export function ProfileCard({
  fullName,
  // profileId,
  profilePic,
  paymentStatus,
  age,
  caste,
  religion,
  height,
  country,
  profession,
  educationLevel,
}: ProfileCardProps) {
  const membershipLabel = paymentStatus === "PAID" ? "Elite" : "Verified";
  const badgeVariant = paymentStatus === "PAID" ? "default" : "secondary";

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
              {/* {profileId} */}
              <Badge variant={badgeVariant}>{membershipLabel}</Badge>
              <h4 className="text-xl font-newsreader text-black">{fullName}</h4>
              <span className="flex items-center gap-1 -mt-2 text-sm text-muted">
                <MapPin size={16} />
                {country}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" type="button" className="rounded-full">
              <Star size={18} />
            </Button>
            <Button variant="outline" type="button" className="rounded-full">
              <Heart size={18} />
            </Button>
            <Button variant="outline" type="button" className="rounded-full">
              <Bookmark size={18} />
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
            const spanClass = isFirstTwo ? "col-span-2 md:col-span-2" : "col-span-1";
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
          <div className="flex md:hidden items-center gap-2">
            <Button variant="outline" type="button" className="rounded-full">
              <Star size={18} />
            </Button>
            <Button variant="outline" type="button" className="rounded-full">
              <Heart size={18} />
            </Button>
            <Button variant="outline" type="button" className="rounded-full">
              <Bookmark size={18} />
            </Button>
          </div>
          <Button variant="link">
            View Profile <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
