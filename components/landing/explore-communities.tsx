import React from "react";
import Image from "next/image";
import {Card} from "@/components/ui/card";
import {COMMUNITIES} from "@/lib/constants";
import Link from "next/link";

const ExploreCommunities = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-10 w-full">
            {COMMUNITIES.map((community) => (
                <Link
                    key={community.label} href={community.href}>
                    <Card
                        className="bg-black/90 backdrop-blur-md rounded-sm p-6 flex flex-col items-center justify-center hover:bg-black/70 transition cursor-pointer hover:shadow-2xl"
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
                            <h3 className="text-center font-sans text-white font-medium text-lg">
                                {community.label}
                            </h3>
                            <p className="text-center text-xs text-muted tracking-widest uppercase">
                                {community.adLength} active ads
                            </p>
                        </div>
                    </Card>
                </Link>

            ))}
        </div>
    );
};

export default ExploreCommunities;
