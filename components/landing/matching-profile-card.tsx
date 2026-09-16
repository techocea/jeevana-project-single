"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {MapPin, Briefcase, GraduationCap, Sparkles, Check, Eye, Heart, Loader2} from "lucide-react";
import {getScoreBadgeStyle} from "@/helpers/get-status-badge";
import {useEffect, useState, useTransition} from "react";
import {addProfileToFavorite} from "@/app/actions/profile-actions";
import toast from "react-hot-toast";

interface ProfileData {
    id: string;
    fullName: string | null;
    age: number | null;
    gender: string | null;
    profession: string | null;
    educationLevel: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    profilePic: string | null;
    isFavorited?: boolean;
}

interface ProfileMatchItem {
    id: string;
    score: number;
    matchReasons: string[] | null;
    matchedProfile: ProfileData;
}

interface MatchingProfileCardProps {
    match: ProfileMatchItem;
    currentProfileId: string;
}

const MatchingProfileCard = ({ match,currentProfileId }: MatchingProfileCardProps) =>{
    const { score, matchReasons, matchedProfile } = match;

    // const [favorited, setFavorited] = useState<boolean>(matchedProfile?.isFavorited ?? false);
    // const [isPending, startTransition] = useTransition();
    //
    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/set-state-in-effect
    //     setFavorited(matchedProfile?.isFavorited ?? false);
    // }, [matchedProfile?.isFavorited]);
    //
    // const handleFavoriteClick = () => {
    //     if (!currentProfileId || !matchedProfile?.id) return;
    //
    //     const previousState = favorited;
    //     setFavorited(!previousState);
    //
    //     startTransition(async () => {
    //         const result = await addProfileToFavorite(currentProfileId, matchedProfile.id);
    //
    //         if (!result.success) {
    //             setFavorited(previousState);
    //             toast.error("Failed to update favorites. Please try again.");
    //         }else{
    //             toast.success(
    //                 previousState ? "Removed from favorites" : "Profile added to favorites"
    //             );
    //         }
    //     });
    // };

    const locationStr = [matchedProfile.city, matchedProfile.country]
        .filter(Boolean)
        .join(", ");

    return(
        <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border border-border">
            <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-3">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                        {matchedProfile.profilePic ? (
                            <Image
                                src={matchedProfile.profilePic}
                                alt={matchedProfile.fullName || "Profile"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-semibold text-muted-foreground">
                                {matchedProfile.fullName?.substring(0, 2).toUpperCase() || "JV"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold leading-tight text-black">
                            {matchedProfile.fullName || "Anonymous Member"} &nbsp;
                            {matchedProfile.age && (
                                <span className="text-sm font-normal text-muted-foreground">
                  ({matchedProfile.age} yrs)
                </span>
                            )}
                        </h3>
                        {locationStr && (
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                                {locationStr}
                            </p>
                        )}
                    </div>
                </div>

                <Badge variant="outline" className={`font-bold px-3 py-1 ${getScoreBadgeStyle(score)}`}>
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    {score}% Match
                </Badge>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 space-y-4">
                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-black rounded-lg">
                    {matchedProfile.profession && (
                        <div className="flex items-center gap-2">
                            <span><Briefcase className="h-4 w-4 text-primary" /></span>
                            <span className="truncate">{matchedProfile.profession}</span>
                        </div>
                    )}
                    {matchedProfile.educationLevel && (
                        <div className="flex items-center gap-2">
                           <span><GraduationCap className="h-4 w-4 text-primary" /></span>
                            <span className="truncate">{matchedProfile.educationLevel}</span>
                        </div>
                    )}
                </div>

                {/* Match Reasons List */}
                {matchReasons && matchReasons.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted">Matched Reasons:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {matchReasons.map((reason, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2">
                                    [<Check className="h-4 w-4 text-emerald-700 font-bold" />
                                    <span className="text-muted-foreground">{reason}</span>]
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-5 pt-0 flex gap-2">
                <Button variant="default"className="flex-1">
                    <Eye className="h-3.5 w-3.5" />
                    <Link href={`/profiles/${matchedProfile.id}`}>View Profile</Link>
                </Button>

                {/*<Button*/}
                {/*    variant="outline"*/}
                {/*    size="icon"*/}
                {/*    onClick={handleFavoriteClick}*/}
                {/*    disabled={isPending}*/}
                {/*    className="h-8 w-8 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30"*/}
                {/*    title={favorited ? "Remove from favorites" : "Add to favorites"}*/}
                {/*>*/}
                {/*    {isPending ? (*/}
                {/*        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />*/}
                {/*    ) : (*/}
                {/*        <Heart*/}
                {/*            className={`h-5 w-5 transition-colors ${*/}
                {/*                favorited*/}
                {/*                    ? "fill-rose-500 text-rose-500"*/}
                {/*                    : "text-muted-foreground hover:text-rose-500"*/}
                {/*            }`}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*</Button>*/}
            </CardFooter>
        </Card>
    )
}

export default MatchingProfileCard;