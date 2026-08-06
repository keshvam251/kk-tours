"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Animated counter ─── */
function useCountUp(end: number, inView: boolean, suffix = "") {
  const [display, setDisplay] = useState(`0${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 45;
    const increment = end / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), end);
      setDisplay(`${current}${suffix}`);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end, inView, suffix]);
  return display;
}

/* ─── Values / Why Choose Us data ─── */
const values = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Treated Like Family",
    desc: "We don't treat you as a customer — you're family. Ankur Sharma personally ensures every traveler feels at home.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Budget Friendly",
    desc: "We provide amazing travel experiences at affordable prices. No hidden charges, no surprises — just honest pricing.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Trusted & Reliable",
    desc: "With a 4.4★ Google rating and 87+ happy reviews, our track record speaks for itself. Serving Katra for years.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Local Expertise",
    desc: "Based in Katra, we know every corner of Jammu & Kashmir. Get the most authentic, insider travel experience.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "End-to-End Service",
    desc: "From airport pickup to hotel booking, sightseeing to drop-off — we handle everything so you can relax.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "24/7 Assistance",
    desc: "Our team is available round the clock. Whether it's early morning yatra or late-night travel, we're always here.",
  },
];

/* ─── Services ─── */
const services = [
  { name: "Vaishno Devi Yatra", icon: "🙏" },
  { name: "Kashmir Tour Packages", icon: "🏔️" },
  { name: "Hotel & Room Booking", icon: "🏨" },
  { name: "Cab & Taxi Service", icon: "🚗" },
  { name: "Airport/Station Pickup", icon: "✈️" },
  { name: "Group Tours", icon: "👨‍👩‍👧‍👦" },
  { name: "Honeymoon Packages", icon: "💑" },
  { name: "Customized Itineraries", icon: "📝" },
];

/* ─── Timeline milestones ─── */
const milestones = [
  { year: "Founded", text: "KK Tour & Travel started in Katra with a vision to make Jammu & Kashmir accessible to every traveler." },
  { year: "Growing", text: "Expanded services to cover full Kashmir circuit — Srinagar, Gulmarg, Pahalgam, Sonamarg, and Ladakh." },
  { year: "50+ Destinations", text: "Now offering 50+ curated destinations with hotel stays, cab services, and complete tour packages." },
  { year: "Today", text: "87+ Google reviews, 4.4★ rating, and thousands of happy travelers. Still growing, still family." },
];

export default function AboutPageContent() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const travelers = useCountUp(87, statsInView, "+");
  const destinations = useCountUp(50, statsInView, "+");
  const rating = statsInView ? "4.4/5" : "0";
  const years = statsInView ? "Years" : "0";

  return (
    <main className="bg-white">
      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/travel-banner.png"
          alt="Kashmir mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            About KK Tour & Travel
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Your family in Katra — trusted since years for Vaishno Devi yatra &amp; Kashmir tours.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. OUR STORY — Image + Text Split
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image side */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <Image
              src="/about-team.png"
              alt="Ankur Sharma — Founder of KK Tour & Travel"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white font-semibold text-lg">Ankur Sharma</p>
              <p className="text-white/70 text-sm">Founder &amp; Tour Guide</p>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Who We Are
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              More Than a Tour Company —{" "}
              <span className="text-amber-500">We&apos;re Family</span>
            </h2>
            <div className="mt-6 space-y-4 text-gray-500 leading-relaxed">
              <p>
                <strong className="text-gray-800">KK Tour &amp; Travel</strong> was
                founded by <strong className="text-gray-800">Ankur Sharma</strong> in
                Katra, Jammu &amp; Kashmir, with a simple mission — to give every
                traveler the same warmth, care, and hospitality that they&apos;d get
                from family.
              </p>
              <p>
                Based right at the gateway to the holy Vaishno Devi shrine, we
                specialize in complete tour management — from your arrival in Katra
                to Srinagar, Gulmarg, Pahalgam, Sonamarg, and beyond. Whether
                it&apos;s a budget-friendly yatra, a dreamy honeymoon in Kashmir, or
                a family adventure in Ladakh, we handle it all.
              </p>
              <p>
                Our guests don&apos;t leave as customers — they leave as friends who
                keep coming back. With 87+ positive Google reviews, a 4.4★ rating,
                and years of on-ground experience, we&apos;re proud to be Katra&apos;s
                most trusted travel partner.
              </p>
            </div>

            {/* Quick contact */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+919697258667"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm py-3 px-6 rounded-full transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 96972 58667
              </a>
              <a
                href="https://wa.me/919697258667?text=Hi%20Ankur%2C%20I%20want%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm py-3 px-6 rounded-full transition-colors duration-300 shadow-lg shadow-amber-500/20"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with Ankur
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. STATS BAR
         ════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 py-16 px-4" ref={statsRef}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: travelers, label: "Happy Travelers", color: "text-amber-400" },
            { value: destinations, label: "Destinations", color: "text-teal-400" },
            { value: rating, label: "Google Rating", color: "text-amber-400" },
            { value: years, label: "Of Experience", color: "text-teal-400" },
          ].map((s) => (
            <div key={s.label}>
              <p className={`text-4xl sm:text-5xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-white/50 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. WHY CHOOSE US
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Why KK Tour & Travel
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Why Travelers Choose Us
            </h2>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. OUR SERVICES
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              What We Offer
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Our Services
            </h2>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {services.map((s) => (
              <div
                key={s.name}
                className="group flex flex-col items-center gap-3 bg-gray-50 hover:bg-amber-50 rounded-2xl p-6 transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:shadow-md"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </span>
                <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. OUR JOURNEY TIMELINE
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              How We Got Here
            </h2>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative pl-14">
                  {/* Dot */}
                  <div
                    className={`absolute left-3 top-1 w-5 h-5 rounded-full border-2 ${
                      i === milestones.length - 1
                        ? "bg-amber-500 border-amber-500"
                        : "bg-white border-amber-400"
                    }`}
                  />
                  <span className="inline-block text-amber-500 font-bold text-sm tracking-wide mb-1">
                    {m.year}
                  </span>
                  <p className="text-gray-600 leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. GOOGLE MAP EMBED
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Find Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Visit Our Office in Katra
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Located in the heart of Katra, near the Vaishno Devi route. Drop by anytime or call us!
            </p>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3370.6!2d74.9353285!3d32.9914833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e79aa0c066bb3%3A0x5cdba12782b1a340!2skk%20tour%20travel%20katra!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KK Tour & Travel Location"
              />
            </div>

            {/* Contact info cards */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Address</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Katra, Reasi District,<br />
                  Jammu &amp; Kashmir 182301,<br />
                  India
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Phone</h4>
                </div>
                <a href="tel:+919697258667" className="text-gray-500 text-sm hover:text-amber-500 transition-colors">
                  +91 96972 58667
                </a>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Hours</h4>
                </div>
                <p className="text-gray-500 text-sm">
                  Open 24 hours<br />
                  <span className="text-emerald-500 font-medium">● Available Now</span>
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/QT1z5bLdRtCR5Uw39"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-amber-500 text-white font-semibold text-sm text-center py-3.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Directions on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. CTA BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Explore Jammu &amp; Kashmir?
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Let Ankur &amp; team plan your perfect trip. Reach out today!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919697258667?text=Hi%20Ankur%2C%20I%20want%20to%20plan%20a%20trip%20to%20Kashmir."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 transform hover:scale-105"
            >
              Plan My Trip on WhatsApp
            </a>
            <a
              href="tel:+919697258667"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-300 border border-white/20"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
