"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface StatItem {
  value: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  { value: "87+", label: "Happy Travelers", color: "text-amber-500" },
  { value: "50+", label: "Top Destinations", color: "text-teal-600" },
  { value: "4.4/5", label: "Customer Reviews", color: "text-amber-500" },
  { value: "J&K", label: "Specialist Region", color: "text-teal-600" },
];

/* ─── Animated counter hook ─── */
function useCountUp(target: string, inView: boolean) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    // If the target is not purely numeric (e.g., "4.4/5" or "J&K"), just show it
    const numericMatch = target.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplay(target);
      return;
    }

    const end = parseInt(numericMatch[1], 10);
    const suffix = target.slice(numericMatch[1].length); // e.g., "+" or "/5"
    const duration = 1600; // ms
    const steps = 40;
    const increment = end / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), end);
      setDisplay(`${current}${suffix}`);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, inView]);

  return display;
}

function StatCard({ stat, inView }: { stat: StatItem; inView: boolean }) {
  const display = useCountUp(stat.value, inView);

  return (
    <div className="flex flex-col items-center px-6 py-4 transition-transform duration-300 hover:scale-105">
      <span
        className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${stat.color}`}
      >
        {display}
      </span>
      <span className="mt-1 text-sm sm:text-base text-gray-500 font-medium">
        {stat.label}
      </span>
    </div>
  );
}

export default function BannerSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full" id="banner">
      {/* ── Hero banner image with overlay ── */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/travel-banner.png"
          alt="Happy travelers exploring the mountains of Kashmir"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-xl max-w-3xl"
            style={{ fontFamily: "'Geist', serif" }}
          >
            No matter where you&apos;re going from,
            <br />
            <span className="text-amber-300">we take you there</span>
          </h2>
          <p className="mt-5 text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed drop-shadow-lg">
            KK Tour &amp; Travel, Katra — your trusted partner for unforgettable
            journeys across Jammu &amp; Kashmir since years.
          </p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        ref={statsRef}
        className="relative z-10 max-w-5xl mx-auto -mt-14 bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 py-6 sm:py-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>

      {/* Spacing below the floating card */}
      <div className="h-10" />
    </section>
  );
}
