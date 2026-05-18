import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { COMMUNITIES } from "@/lib/constants";

const ExploreCommunities = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full">
      {COMMUNITIES.map((community) => (
        <Card
          key={community.label}
          className="bg-foreground/5 rounded-sm p-6 flex flex-col items-center justify-center hover:bg-foreground/10 transition cursor-pointer hover:shadow-2xl"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-white/5 rounded-full ">
            <Image
              src={community.icon}
              alt={community.label}
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-center text-white font-medium text-lg">
              {community.label}
            </h3>
            <p className="text-center text-xs text-muted tracking-widest uppercase">
              {community.adLength} active ads
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExploreCommunities;
