import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-12">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Social Media */}
          <div>
            <div>
              <Image
                src="/images/logo.png"
                alt="matrimony, matrimonial ads, marriage bureau, find life partner, wedding ads, jeevana matrimony"
                width={120}
                height={50}
              />
            </div>
            {/* <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition"><Linkedin size={20} /></a>
            </div> */}
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

          {/* Links */}
          <div>
            <h3 className="text-primary mb-4 font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-primary mb-4 font-medium text-lg">
              Learn More
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Monthly Magazine
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <p className="text-sm text-white">
            CURATED EXCELLENCE IN MATRIMONY. OUR MISSION IS TO FOSTER LIFELONG
            UNIONS ROOTED IN DIGNITY AND HERITAGE.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-xs text-muted-foreground">&copy; Copyright {new Date().getFullYear()} By Soulmate Matrimony. All Rights Reserved - Powered By <span><Link href="https://www.webizera.com" className="font-semibold">Webizera</Link></span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
