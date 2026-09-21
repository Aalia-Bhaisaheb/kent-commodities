import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="relative w-full text-white">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/footer-bg.png"
                    alt="Footer Background"
                    fill
                    className="object-cover object-center"
                // priority={false}
                />
                {/* Soft gradient overlay instead of heavy solid black */}
                <div className="absolute inset-0 " />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
                {/* Top Section: Brand + Links */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12">

                    {/* Brand Info (Left Column) */}
                    <div className="md:col-span-6 lg:col-span-6 space-y-4">

                        {/* FIXED LOGO CONTAINER */}
                        <div className="relative w-30 h-12 mb-2">
                            <Image
                                src="/logo-white.png"
                                alt="Kent Commodities"
                                fill
                                priority
                                className="object-contain object-left"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md">
                            Leading the market in supply chain management in GCC market. Providing mining, electrical, and other industrial solutions worldwide with prime focus in oil and gas industry.
                        </p>

                        {/* Social Icons Container */}
                        <div className="flex items-center space-x-3 pt-2">
                        <a 
  href="#" 
  aria-label="X (Twitter)" 
  className="w-10 h-10 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors duration-200"
>
  <FaXTwitter className="w-4 h-4" />
</a>

<a 
  href="#" 
  aria-label="Facebook" 
  className="w-10 h-10 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors duration-200"
>
  <FaFacebookF className="w-4 h-4" />
</a>

<a 
  href="#" 
  aria-label="Instagram" 
  className="w-10 h-10 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors duration-200"
>
  <FaInstagram className="w-4 h-4" />
</a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="md:col-span-3 lg:col-span-3 space-y-4">
                        <h3 className="text-base font-semibold text-white tracking-wide">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                            <li>
                                <Link href="/" className="hover:text-lime-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-lime-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-lime-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Commodities Column */}
                    <div className="md:col-span-3 lg:col-span-3 space-y-4">
                        <h3 className="text-base font-semibold text-white tracking-wide">
                            Commodities
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                            <li>
                                <Link href="/agriculture" className="hover:text-lime-400 transition-colors">
                                    Agriculture Commodities
                                </Link>
                            </li>
                            <li>
                                <Link href="/mining" className="hover:text-lime-400 transition-colors">
                                    Mining Commodities
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full border-t border-gray-500/60 my-6" />
                {/* Middle Section: Regional Offices */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
                    {/* Dubai Office */}
                    <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-500/60 pb-6 md:pb-0 md:pr-6">
                        <div className="flex flex-col items-start space-y-2">
                            <Image
                                src="/uae-flag.png"
                                alt="UAE"
                                width={42}
                                height={42}
                                className="object-cover object-center"
                            />
                            <h4 className="text-base font-semibold text-white">Dubai - HQ</h4>
                        </div>

                        <div className="flex items-start space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0 mt-0.5"><MapPin /></span>
                            <span>2904 AA1, Al Mazaya Business Avenue Tower, Dubai, UAE</span>
                        </div>

                        <div className="flex items-center space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0"><Phone /></span>
                            <a href="tel:+97144107779" className="hover:text-lime-400 transition-colors">
                                +971 4 410 7779
                            </a>
                        </div>
                    </div>

                    {/* Oman Office */}
                    <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-500/60 pb-6 md:pb-0 md:px-6">
                        <div className="flex flex-col items-start space-y-2">
                            <Image
                                src="/oman-flag.png"
                                alt="OMAN"
                                width={42}
                                height={42}
                                className="object-cover object-center"
                            />
                            <h4 className="text-base font-semibold text-white">Oman</h4>
                        </div>

                        <div className="flex items-start space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0 mt-0.5"><MapPin /></span>
                            <span>P.O Box: P.C :112, Muscat-Sultanate Of Oman</span>
                        </div>

                        <div className="flex items-center space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0"><Phone /></span>
                            <a href="tel:+97144107779" className="hover:text-lime-400 transition-colors">
                                +971 4 410 7779
                            </a>
                        </div>
                    </div>

                    {/* India Office */}
                    <div className="space-y-3 md:pl-6">
                        <div className="flex flex-col items-start space-y-2">
                            <Image
                                src="/india-flag.png"
                                alt="INDIA"
                                width={42}
                                height={42}
                                className="object-cover object-center"
                            />
                            <h4 className="text-base font-semibold text-white">India</h4>
                        </div>

                        <div className="flex items-start space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0 mt-0.5"><MapPin /></span>
                            <span>27-28, Madhuban Sqare, Karjan, Vadodara, Gujarat, India</span>
                        </div>

                        <div className="flex items-center space-x-2.5 text-sm text-gray-300">
                            <span className="text-lime-400 font-bold shrink-0"><Phone /></span>
                            <a href="tel:+97144107779" className="hover:text-lime-400 transition-colors">
                                +971 4 410 7779
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright */}
                <div className="border-t border-gray-800/80 mt-8 pt-6 text-center">
                    <p className="text-xs text-gray-400">
                        © 2026 Kent commodities | All Rights Reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}