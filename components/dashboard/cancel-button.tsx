"use client";

import {Button} from "../ui/button";
import {useRouter} from "next/navigation";

export function CancelButton() {
    const router = useRouter();
    return <Button size={"lg"} variant={"outline"} onClick={() => router.back()}>Cancel</Button>
}