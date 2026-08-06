"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

interface Destination {
  id: string | number;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
  gradient?: string;
  duration: string;
  price: string;
}

const INITIAL_COUNT = 6;

export default function DestinationsSection() {
  const [showAll, setShowAll] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    async function fetchFirebasePackages() {
      try {
        const q = query(collection(db, "packages"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const dbPkgs = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Destination[];
          setDestinations(dbPkgs);
        } else {
          setDestinations([]);
        }
      } catch (err: any) {
        console.error("Error loading packages:", err);
        if (err?.code === "permission-denied" || err?.message?.includes("permissions")) {
          setPermissionError(true);
        }
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFirebasePackages();
  }, []);

  const visibleDestinations = showAll
    ? destinations
    : destinations.slice(0, INITIAL_COUNT);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="destinations">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          Discover Your Dream Destination
        </h2>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Handpicked tour packages across the breathtaking landscapes of Jammu &amp;
          Kashmir — from snow-capped peaks to serene lakes.
        </p>
        {/* Accent line */}
        <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
      </div>

      {permissionError ? (
        <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center">
          <span className="text-3xl mb-2 inline-block">🔒</span>
          <h3 className="text-lg font-bold text-amber-900 mb-2">Firebase Permission Error</h3>
          <p className="text-amber-800 text-sm leading-relaxed mb-4">
            Firestore Database requires read access. Please update your Security Rules in Firebase Console:
          </p>
          <div className="bg-gray-900 text-amber-300 text-xs font-mono p-4 rounded-xl text-left overflow-x-auto mb-4">
            <p>1. Go to Firebase Console → Firestore Database → Rules</p>
            <p>2. Change rule to: <span className="text-white font-bold">allow read, write: if true;</span></p>
            <p>3. Click &quot;Publish&quot;</p>
          </div>
        </div>
      ) : loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-3xl aspect-[4/3] border border-gray-200" />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-xl mx-auto px-6">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tour Packages Added Yet</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Tour packages created in the Admin Panel will be listed here live.
          </p>
          <a
            href="/admin"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md"
          >
            Go to Admin Dashboard
          </a>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}

      {/* View All / Show Less Button */}
      {destinations.length > INITIAL_COUNT && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105"
          >
            {showAll ? "Show Less" : "View All Packages"}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Individual Card ─── */
function DestinationCard({ destination }: { destination: Destination }) {
  const whatsappText = encodeURIComponent(
    `Hi, I want to book the ${destination.name} package (${destination.duration}, ${destination.price}).`
  );

  const defaultDescription =
    "Experience breathtaking sightseeing, luxury stay, transfers, and curated travel itineraries across scenic locations.";

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1">
      {/* Top Image Container */}
      <div>
        <div className="relative w-full aspect-[16/10] bg-gray-900 overflow-hidden">
          {destination.imageUrl ? (
            <Image
              src={destination.imageUrl}
              alt={destination.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: destination.gradient || "linear-gradient(135deg, #0f766e, #064e3b)" }}
            />
          )}

          {/* Location badge on top left */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 z-10 border border-white/10">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{destination.location}</span>
          </div>

          {/* Duration badge on top right */}
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-gray-950 px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
            {destination.duration}
          </div>

          {/* Subtle bottom shadow overlay on image */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent z-0" />
        </div>

        {/* Card Body */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
            {destination.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {destination.description && destination.description.trim() !== ""
              ? destination.description
              : defaultDescription}
          </p>
        </div>
      </div>

      {/* Card Footer with Price and Book Now Button */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100/80 mt-auto">
        <div>
          <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Starting from</span>
          <span className="text-xl font-extrabold text-gray-900">{destination.price}</span>
        </div>
        <a
          href={`https://wa.me/918082069080?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer transform hover:scale-105"
        >
          <span>Book Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}


