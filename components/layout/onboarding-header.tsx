"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import React from "react";

const OnboardingHeader = () => {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex h-16 md:max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Jeevana Matrimony"
            width={120}
            height={50}
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-white">
            Pricing
          </Link>
          <Link href="/contact-us" className="text-sm text-white">
            Support
          </Link>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
