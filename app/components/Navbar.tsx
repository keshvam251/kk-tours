"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BookNowPopup from "./BookNowPopup";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Rooms", href: "/rooms" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Page routes (e.g., /about)
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    // Hash scroll (e.g., #destinations)
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Keep navbar visible when mobile menu is open
  const isHidden = hidden && !mobileOpen;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-400 ease-in-out ${isHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        style={{
          top: 0,
          background: scrolled
            ? "rgba(15, 23, 42, 0.85)"
            : "rgba(15, 23, 42, 0.35)",
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0,0,0,0.15)"
            : "none",
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <button
            onClick={() => handleNavClick("#")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <Image
              src="/logo.png"
              alt="KK Tours and Travels Katra Logo"
              width={42}
              height={42}
              className="h-10 w-auto object-contain rounded-md shadow-sm"
              unoptimized
            />
            <span
              className="text-white text-[15px] sm:text-lg font-bold tracking-tight flex flex-col leading-tight"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <span>KK <span className="text-amber-400">International</span></span>
              <span className="text-white/50 font-normal text-[10px] sm:text-[11px] tracking-wide">
                Tours &amp; Travels &amp; Home Stay
              </span>
            </span>
          </button>

          {/* ── Desktop Nav Links (centered) ── */}
          <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative px-5 py-2 text-[15px] font-medium text-white/75 hover:text-white transition-colors duration-300 cursor-pointer group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber-400 rounded-full group-hover:w-6 transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* ── Right side: Phone + CTA ── */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <a
              href="tel:+918082069080"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +91 80820 69080
            </a>
            <button
              onClick={() => setBookingOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2 px-6 rounded-full transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-105 cursor-pointer"
            >
              Book Now
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
              />
              <span
                className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
              />
              <span
                className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileOpen ? "visible" : "invisible"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 transition-transform duration-500 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex flex-col pt-20 px-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-white/75 hover:text-white text-[17px] font-medium py-4 border-b border-white/8 transition-all duration-300 cursor-pointer hover:pl-2"
              >
                {link.label}
              </button>
            ))}

            <a
              href="tel:+918082069080"
              className="flex items-center gap-3 text-white/60 hover:text-white py-4 border-b border-white/8 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +91 80820 69080
            </a>

            <button
              onClick={() => {
                setMobileOpen(false);
                setBookingOpen(true);
              }}
              className="mt-6 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-center py-3 px-6 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Book Now Popup ── */}
      <BookNowPopup isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
