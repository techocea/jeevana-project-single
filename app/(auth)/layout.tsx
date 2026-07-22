import type { Metadata } from "next";
import OnboardingHeader from "@/components/layout/onboarding-header";

export const metadata: Metadata = {
  title: "Onboarding | Jeevana Matrimony",
  description:
    "Register or log in to Jeevana with dedicated onboarding support.",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingHeader />
      <main>{children}</main>
    </div>
  );
}
