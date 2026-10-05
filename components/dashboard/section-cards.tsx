"use client";

import {Badge} from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    TrendingUpIcon,
    FolderHeart,
    CircleDollarSign,
    Users,
} from "lucide-react";
import {Progress} from "../ui/progress";
import Image from "next/image";
import {AppRole} from "@/lib/constants";

export function SectionCards({role}: { role: AppRole }) {
    return (
        <div className="grid grid-cols-1 gap-4  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card
                className="@container/card [container-type:inline-size] bg-white shadow-sm border border-neutral-200/80 rounded-xl">
                <CardHeader className="flex flex-col gap-2">
                    <CardAction className="flex items-center justify-between w-full">
              <span
                  className="bg-indigo-50 text-indigo-600 w-10 h-10 flex items-center justify-center rounded-xl transition-colors">
            <FolderHeart className="w-5 h-5"/>
          </span>
                        <Badge variant="secondary"
                               className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200/60">
                            <TrendingUpIcon className="w-3.5 h-3.5"/>
                            +8.5%
                        </Badge>
                    </CardAction>
                    <CardDescription className="uppercase">Total Ads</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        1,234
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-2 text-xs text-muted-foreground pt-0 px-5">
                    <Progress value={85} className="h-1.5 w-full bg-neutral-100 [&>div]:bg-indigo-600"/>
                    <div className="flex justify-between w-full text-neutral-500 font-medium">
                        <span>Target Reach</span>
                        <span>85%</span>
                    </div>
                </CardFooter>
            </Card>
            {role === "admin" && (
                <Card
                    className="@container/card [container-type:inline-size] bg-white shadow-sm border border-neutral-200/80 rounded-xl">
                    <CardHeader className="flex flex-col gap-2 p-5">
                        <CardAction className="flex items-center justify-between w-full">
            <span className="bg-emerald-50 text-emerald-600 w-10 h-10 flex items-center justify-center rounded-xl">
              <CircleDollarSign className="size-5"/>
            </span>
                            <Badge variant="secondary"
                                   className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200/60">
                                <TrendingUpIcon className="size-3.5"/>
                                +20%
                            </Badge>
                        </CardAction>

                        <div className="space-y-1 mt-1">
                            <CardDescription
                                className="uppercase text-xs font-semibold tracking-wider text-muted-foreground">
                                Monthly Revenue
                            </CardDescription>
                            <CardTitle
                                className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums @[250px]/card:text-3xl">
                                LKR 2,123,456
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardFooter
                        className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-0 px-5">
                        <span className="font-medium text-neutral-500">30-day trend</span>
                        <Image
                            src="/images/revenue-trend.png"
                            alt="Revenue trend graph"
                            width={92}
                            height={36}
                            className="h-9 w-auto object-contain"
                        />
                    </CardFooter>
                </Card>
            )}
            <Card
                className="@container/card [container-type:inline-size] bg-white shadow-sm border border-neutral-200/80 rounded-xl">
                <CardHeader className="flex flex-col gap-2 p-5">
                    <CardAction className="flex items-center justify-between w-full">
            <span className="bg-amber-50 text-amber-600 w-10 h-10 flex items-center justify-center rounded-xl">
              <Users className="size-5"/>
            </span>
                        <Badge variant="secondary"
                               className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200/60">
                            <TrendingUpIcon className="size-3.5"/>
                            +12.5%
                        </Badge>
                    </CardAction>

                    <div className="space-y-1 mt-1">
                        <CardDescription
                            className="uppercase text-xs font-semibold tracking-wider text-muted-foreground">
                            Active Accounts
                        </CardDescription>
                        <CardTitle
                            className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums @[250px]/card:text-3xl">
                            989
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardFooter className="flex flex-col items-start gap-1 text-xs pt-0 px-5 ">
                    <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-neutral-800">
                        Strong user retention <TrendingUpIcon className="size-3.5 text-emerald-600"/>
                    </div>
                    <p className="text-muted-foreground">Engagement exceeds targets</p>
                </CardFooter>
            </Card>
            <Card
                className="@container/card [container-type:inline-size] bg-white shadow-sm border border-neutral-200/80 rounded-xl">
                <CardHeader className="flex flex-col gap-2 p-5">
                    <CardAction className="flex items-center justify-between w-full">
            <span className="bg-sky-50 text-sky-600 w-10 h-10 flex items-center justify-center rounded-xl">
              <TrendingUpIcon className="size-5"/>
            </span>
                        <Badge variant="secondary"
                               className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200/60">
                            <TrendingUpIcon className="size-3.5"/>
                            +4.5%
                        </Badge>
                    </CardAction>

                    <div className="space-y-1 mt-1">
                        <CardDescription
                            className="uppercase text-xs font-semibold tracking-wider text-muted-foreground">
                            Growth Rate
                        </CardDescription>
                        <CardTitle
                            className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums @[250px]/card:text-3xl">
                            4.5%
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardFooter className="flex flex-col items-start gap-1 text-xs pt-0 px-5 ">
                    <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-neutral-800">
                        Steady performance increase <TrendingUpIcon className="size-3.5 text-emerald-600"/>
                    </div>
                    <p className="text-muted-foreground">Meets growth projections</p>
                </CardFooter>
            </Card>
        </div>
    );
}
