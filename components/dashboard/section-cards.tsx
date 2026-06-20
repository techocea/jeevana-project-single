"use client";

import { Badge } from "@/components/ui/badge";
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
  TrendingDownIcon,
  FolderHeart,
  CircleDollarSign,
  Users,
} from "lucide-react";
import { Progress } from "../ui/progress";
import Image from "next/image";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card ">
      <Card className="@container/card">
        <CardHeader className="flex flex-col gap-2">
          <CardAction className="flex items-center justify-between w-full">
              <span className="bg-accent/25 text-secondary w-8 h-8 flex items-center justify-center rounded-full">
              <FolderHeart />
            </span>
            <Badge variant="secondary">
              <TrendingUpIcon />
              +8.5%
            </Badge>
          </CardAction>
          <CardDescription className="uppercase">Total Ads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Progress value={85} className="h-1"/>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-col gap-2">
        <CardAction className="flex items-center justify-between w-full">
            <span className="bg-accent/25 text-secondary w-8 h-8 flex items-center justify-center rounded-full">
            <CircleDollarSign />
          </span>
          <Badge variant="secondary">
            <TrendingUpIcon />
            +20%
          </Badge>
        </CardAction>
          <CardDescription className="uppercase">Monthly Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            LKR 2,123,456
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Image src="/images/revenue-trend.png" alt="" width={92} height={44} />
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-col gap-2">
        <CardAction className="flex items-center justify-between w-full">
            <span className="bg-accent/25 text-secondary w-8 h-8 flex items-center justify-center rounded-full">
            <Users />
          </span>
          <Badge variant="secondary">
            <TrendingUpIcon />
            +12.5%
          </Badge>
        </CardAction>
          <CardDescription className="uppercase">Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            989
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-col gap-2">
        <CardAction className="flex items-center justify-between w-full">
          <Badge variant="secondary">
            <TrendingUpIcon />
            +4.5%
          </Badge>
        </CardAction>
          <CardDescription className="uppercase">Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
