"use client";

import React, { useState } from "react";
import { User, Search, Cake, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

const SearchMatch = () => {
  const router = useRouter();

  const [lookingFor, setLookingFor] = useState("bride");
  const [minAge, setMinAge] = useState("18");
  const [maxAge, setMaxAge] = useState("30");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (minAge) params.append("minAge", minAge);
    if (maxAge) params.append("maxAge", maxAge);
    if (lookingFor) params.append("lookingFor", lookingFor);

    router.push(`/search?${params.toString()}`);
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-4 bg-black/5 backdrop-blur-md rounded-full max-w-2xl w-full border border-slate-200 p-3 lg:p-6 shadow-sm">
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center justify-between space-x-4"
      >
        <div className="hidden sm:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent hover:bg-muted/50 rounded-full text-muted-foreground uppercase text-lg">
                <User size={24} className="text-primary mr-2" /> Looking for{" "}
                {lookingFor}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setLookingFor("bride")}>
                  Bride
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLookingFor("groom")}>
                  Groom
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent hover:bg-muted/50 rounded-full text-muted-foreground uppercase text-lg">
                <Cake size={24} className="text-primary mr-2" /> age range (ex:{" "}
                {minAge}-{maxAge})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-sm flex flex-row gap-4 p-4"
              align="start"
            >
              <div className="grid gap-2 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Min age
                </span>
                <select
                  value={minAge}
                  onChange={(event) => setMinAge(event.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {ageOptions.map((age) => (
                    <option key={`min-${age}`} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Max age
                </span>
                <select
                  value={maxAge}
                  onChange={(event) => setMaxAge(event.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {ageOptions.map((age) => (
                    <option key={`max-${age}`} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <div className="flex flex-1 items-center justify-between sm:hidden">
            <DrawerTrigger asChild>
              <Button
                type="button"
                className="bg-transparent hover:bg-muted/50 rounded-full text-muted-foreground uppercase text-lg"
              >
                <SlidersHorizontal size={24} className="text-primary mr-2" /> filters
              </Button>
            </DrawerTrigger>
          </div>

          <Button type="submit" className="rounded-full px-4 py-5">
            <Search size={18} />
            SEARCH
          </Button>

          <DrawerContent side="bottom" className="sm:hidden rounded-t-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Filters for Mobile</DrawerTitle>
            </DrawerHeader>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search filters
              </p>
              <h2 className="text-2xl font-semibold">Refine your match</h2>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Looking for
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={lookingFor === "bride" ? "secondary" : "outline"}
                    className="flex-1 rounded-full"
                    onClick={() => setLookingFor("bride")}
                  >
                    Bride
                  </Button>
                  <Button
                    variant={lookingFor === "groom" ? "secondary" : "outline"}
                    className="flex-1 rounded-full"
                    onClick={() => setLookingFor("groom")}
                  >
                    Groom
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Min age
                </span>
                <select
                  value={minAge}
                  onChange={(event) => setMinAge(event.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {ageOptions.map((age) => (
                    <option key={`min-drawer-${age}`} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Max age
                </span>
                <select
                  value={maxAge}
                  onChange={(event) => setMaxAge(event.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {ageOptions.map((age) => (
                    <option key={`max-drawer-${age}`} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit">Done</Button>
            </div>
          </DrawerContent>
        </Drawer>
      </form>
    </div>
  );
};

export default SearchMatch;
