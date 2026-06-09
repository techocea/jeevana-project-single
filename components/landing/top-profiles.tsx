import React from "react";
import Image from "next/image";
import { PROFILES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TopProfiles = () => {
  const verifiedProfiles = PROFILES.filter((p) => p.isVerified === true);
  const verifiedCount = verifiedProfiles.length;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
     className="w-full max-w-72 sm:max-w-xs md:max-w-full my-10"
    >
      <CarouselContent>
        {verifiedProfiles.map((profile) => (
            <CarouselItem key={profile.fullName} className="sm:basis-1/2">
              <Card className="rounded-3xl bg-white shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between items-center w-full p-4 gap-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={profile.profilePic}
                      alt={profile.narrative}
                      width={128}
                      height={128}
                      priority
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute -right-4 bottom-0 inline-flex items-center rounded-full bg-white/90 p-3 shadow-lg">
                      <span className="text-green-600 text-xl">✔</span>
                    </div>
                  </div>
                  <div className="flex-2 ml-6">
                    <h4 className="font-newsreader text-center md:text-left text-black text-2xl">
                      {profile.fullName}
                    </h4>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="uppercase">
                        <span className="text-muted-foreground">Age:</span>{" "}
                        {profile.age}
                      </div>
                      <div className="uppercase">
                        <span className="text-muted-foreground">Height:</span>{" "}
                        {profile.height}
                      </div>
                      <div className="uppercase">
                        <span className="text-muted-foreground">
                          Religion:
                        </span>{" "}
                        {profile.religion}
                      </div>
                      <div className="uppercase">
                        <span className="text-muted-foreground">Caste:</span>{" "}
                        {profile.caste}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
        ))}
      </CarouselContent>
      {verifiedCount > 2 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};

export default TopProfiles;
