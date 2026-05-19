import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const newsReader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jeevana Matrimony | Find Your Life Partner & Matrimonial Ads",
  description:
    "Register on Jeevana, the trusted matrimonial ad portal. Browse verified profiles, connect with compatible matches, and find your life partner today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsReader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
