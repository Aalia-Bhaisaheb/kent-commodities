"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Agriculture Commodities", href: "/agriculture" },
    { name: "Mining Commodities", href: "/mining" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "w-full max-w-full mt-0 px-0"
            : "w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-7xl mt-4 sm:mt-6 px-0"
        }`}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "w-full rounded-none bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/90 border-t-transparent border-x-transparent px-6 sm:px-10 lg:px-16 py-3.5"
              : "w-full rounded-2xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/80 px-4 sm:px-6 lg:px-8 py-3"
          }`}
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-9 sm:h-10 md:h-11 w-40 sm:w-44 md:w-48 transition-transform duration-200 group-hover:scale-[1.02]">
                <Image
                  src="/logo.svg"
                  alt="Kent Commodities"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 xl:space-x-9">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-[14px] xl:text-[15px] font-medium transition-colors duration-200 ${
                    active
                      ? "text-[#567425]"
                      : "text-gray-700 hover:text-[#567425]"
                  }`}
                >
                  {link.name}

                  {/* Active indicator */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#567425] transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            <Button href="/contact" variant="primary" size="md">
              Contact Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden bg-white shadow-xl border border-gray-100 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ${
              isScrolled ? "rounded-b-2xl border-t-0" : "mt-2 rounded-2xl"
            }`}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      active
                        ? "bg-[#f1f5eb] text-[#567425]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#567425]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Button
                href="/contact"
                variant="primary"
                size="md"
                className="w-full justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}