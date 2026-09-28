"use client";

import Link from "next/link";
import Image from "next/image";
import {Button} from "../ui/button";
import {NAVLINKS} from "@/lib/constants";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {MenuIcon, X} from "lucide-react";

const Header = () => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const isCommunityPage = pathname.includes("community");
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const shouldFloatAtTop = isHomePage || isCommunityPage;

    useEffect(() => {
        if (!shouldFloatAtTop) {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [shouldFloatAtTop]);

    const isFloating = shouldFloatAtTop && !isScrolled;

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
                isFloating ? "pt-6 px-4 md:px-0" : "pt-0 px-0"
            }`}
        >
            <div className={`mx-auto transition-all duration-500 ease-in-out ${
                isFloating
                    ? "w-[92%] md:max-w-5xl bg-black/50 backdrop-blur-md rounded-full border border-white/10 py-2 px-6"
                    : "w-full bg-black border-b border-transparent py-2 px-6"
            }`}
            >
                <nav className="flex items-center justify-between w-full">
                    <div>
                        <Image
                            src="/images/logo.png"
                            alt="matrimony, matrimonial ads, marriage bureau, find life partner, wedding ads, jeevana matrimony"
                            width={120}
                            height={50}
                            style={{width: "auto", height: "auto"}}
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {NAVLINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-sans font-normal text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/auth?mode=login">
                            <Button className="rounded-full px-6">JOIN NOW</Button>
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <Button
                            type="button"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                            aria-expanded={mobileOpen}
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? (
                                <X size={20} className="text-white"/>
                            ) : (
                                <MenuIcon className="text-white"/>
                            )}
                        </Button>
                        {mobileOpen && (
                            <div
                                className="md:hidden absolute top-16 inset-x-0 w-full mt-2 rounded-2xl bg-black border border-white/10 px-6 py-4">
                                <div className="flex flex-col gap-3">
                                    {NAVLINKS.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="rounded-full px-4 py-3 text-white text-center transition hover:bg-white/10"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <Link href="/auth?mode=login" className="w-full">
                                        <Button className="w-full rounded-full p-6">JOIN NOW</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
