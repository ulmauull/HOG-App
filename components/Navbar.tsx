"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Fasilitas", href: "/#fasilitas" },
    { name: "Paket & Harga", href: "/#paket-harga" },
    { name: "Booking PC", href: "/booking" },
    { name: "Status Booking", href: "/booking-status" },
    { name: "Lokasi & Kontak", href: "/#lokasi-kontak" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-20 w-full px-margin flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-space-md">
          <Link href="/" className="flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              <span className="material-symbols-outlined text-[20px]">sports_esports</span>
            </div>
            <span className="font-headline-sm text-headline-sm uppercase text-primary tracking-wider group-hover:text-primary-container transition-colors">
              Home Of Gamers
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-space-sm px-space-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-space-md py-space-sm font-label-md transition-colors rounded-lg ${
                  isActive
                    ? "bg-surface-container-high text-primary-container font-semibold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Avatar */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/booking"
            className="hidden sm:inline-flex items-center justify-center font-label-lg text-label-lg bg-primary-container text-on-primary-fixed font-semibold rounded-lg px-space-lg py-space-sm hover:shadow-[0_0_24px_rgba(0,255,102,0.4)] transition-all"
          >
            Booking Sekarang
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center" title="Akun Member">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-space-sm text-on-surface-variant hover:text-on-surface"
            type="button"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-card border-b border-surface-container-high px-margin py-space-md flex flex-col gap-space-xs animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md ${
                pathname === link.href
                  ? "bg-surface-container-high text-primary-container font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-space-sm w-full py-space-sm rounded-lg bg-primary-container text-on-primary-fixed text-center font-label-lg text-label-lg font-bold"
          >
            Booking PC Sekarang
          </Link>
        </div>
      )}
    </header>
  );
}
