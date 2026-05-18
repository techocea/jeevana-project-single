"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { NAVLINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const headerWrapperStyles = !isHomePage
    ? "fixed top-0 left-0 w-full bg-black" // Outer pages style
    : isScrolled
      ? "fixed top-0 left-0 w-full bg-black" // Homepage scrolled style
      : "fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-black/50 backdrop-blur-md rounded-full border border-white/10"; // Homepage top floating style

  return (
    <header
      className={`${headerWrapperStyles} z-50 transition-all duration-500 ease-in-out`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <nav className="flex items-center justify-between w-full">
          <div>
            <Image
              src="/logo.png"
              alt="matrimony, matrimonial ads, marriage bureau, find life partner, wedding ads, jeevana matrimony"
              width={120}
              height={50}
            />
          </div>
          <div className="hidden md:flex items-center gap-4">
            {NAVLINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-newsreader font-light text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button className="rounded-full px-6">JOIN NOW</Button>
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
                <X size={20} className="text-white" />
              ) : (
                <MenuIcon className="text-white" />
              )}
            </Button>
            {mobileOpen && (
              <div className="md:hidden absolute top-16 inset-x-0 w-full mt-2 rounded-2xl bg-black border border-white/10 px-6 py-4">
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
                  <Button className="w-full rounded-full p-6">JOIN NOW</Button>
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
