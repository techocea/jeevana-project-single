import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { LEARN_MORE_LINKS, RESOURCE_LINKS } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Social Media */}
          <div className="flex flex-col gap-4">
            <div>
              <Image
                src="/images/logo.png"
                alt="matrimony, matrimonial ads, marriage bureau, find life partner, wedding ads, jeevana matrimony"
                width={120}
                height={50}
              />
            </div>
            <p className="text-sm text-white">
              Curated excellence in matrimony. Our mission is to foster lifelong
              unions rooted in dignity and heritage.
            </p>
            {/* <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition"><Linkedin size={20} /></a>
            </div> */}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-primary mb-4 font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-primary mb-4 font-medium text-lg">
              Learn More
            </h3>
            <ul className="space-y-2">
              {LEARN_MORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>contact@poruwa.lk</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>+94 11 234 5678</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={18} className="mt-1" />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; Copyright {new Date().getFullYear()} By Soulmate Matrimony.
            All Rights Reserved - Powered By{" "}
            <span>
              <Link href="https://www.webizera.com" className="font-semibold">
                Webizera
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
