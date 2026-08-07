"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Room types ─── */
interface Room {
  id: string | number;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  imageUrl?: string;
  image?: string;
  features: string[];
  badge?: string;
}

/* ─── Fallback Sample Rooms ─── */
const SAMPLE_ROOMS: Room[] = [
  {
    id: "sample-1",
    name: "Deluxe AC Family Room",
    description:
      "Spacious 4-bed family room equipped with Split AC, LED TV, 24/7 hot water, and ultra-comfortable plush bedding for a peaceful stay after Vaishno Devi Yatra.",
    price: "₹1,499",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["Split AC", "4-Bed Setup", "24/7 Hot Water", "Free High-Speed Wi-Fi", "LED TV"],
    badge: "Most Popular",
  },
  {
    id: "sample-2",
    name: "Executive Double Room",
    description:
      "Luxury double bed room featuring quiet surroundings, modern attached washroom, daily fresh linen, and round-the-clock room service.",
    price: "₹1,999",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["King Bed", "Split AC", "24/7 Room Service", "City View", "Free Parking"],
    badge: "Luxury Choice",
  },
  {
    id: "sample-3",
    name: "Super Deluxe Triple Room",
    description:
      "Perfect for small groups and families. Clean, ventilated room with high-speed Wi-Fi, tea/coffee maker, and prompt room service.",
    price: "₹1,799",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["3-Bed Setup", "Air Conditioning", "Hot Water 24/7", "Clean Daily Linen", "Elevator Access"],
    badge: "Best Value",
  },
  {
    id: "sample-4",
    name: "Standard Economy Stay",
    description:
      "Budget-friendly, cozy room located close to Katra bus stand and yatra registration counter with all essential amenities.",
    price: "₹999",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["Double Bed", "Attached Bath", "24/7 Water", "Free Parking", "Near Yatra Slip"],
    badge: "Budget Friendly",
  },
];

/* ─── Facility icons (SVG inline) ─── */
const facilities: { icon: React.ReactNode; label: string }[] = [
  {
    label: "Free Wi-Fi",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
  },
  {
    label: "Air Conditioning",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707" />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    label: "Hot Water 24/7",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2c.5 3-2 5-2 8a4 4 0 108 0c0-3-2.5-5-2-8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22c-4 0-6-2-6-5 0-2 1-3 2-4" />
      </svg>
    ),
  },
  {
    label: "Room Service",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 18h18M5 18v-1a7 7 0 0114 0v1M12 4v3m-4 1a4 4 0 018 0" />
      </svg>
    ),
  },
  {
    label: "Free Parking",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7h4a3 3 0 010 6H9" />
      </svg>
    ),
  },
  {
    label: "TV & Entertainment",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="13" rx="2" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8m-4-3v3" />
      </svg>
    ),
  },
  {
    label: "Clean Linen Daily",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Near Vaishno Devi",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" strokeWidth={1.5} />
      </svg>
    ),
  },
];

import Link from "next/link";

export default function RoomServiceSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [zoomRoom, setZoomRoom] = useState<{ url: string; title: string; price?: string; priceNote?: string } | null>(null);

  // Mobile Touch Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFirebaseRooms() {
      try {
        const q = query(collection(db, "rooms"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const dbRooms = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Room[];
          setRooms(dbRooms);
        }
      } catch (err) {
        console.error("Error loading rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFirebaseRooms();
  }, []);

  const displayRooms = rooms.length > 0 ? rooms : SAMPLE_ROOMS;

  useEffect(() => {
    if (isPaused || displayRooms.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, displayRooms.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayRooms.length) % displayRooms.length);

  const minSwipeDistance = 40;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden" id="rooms">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
        <span className="inline-flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest bg-amber-100/80 border border-amber-200 px-4 py-1.5 rounded-full mb-3 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Premium Stays &amp; Accommodation
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
          Best Night Stay in Katra
        </h2>
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Experience clean, comfortable, and luxury AC &amp; Non-AC rooms in Katra. Located just minutes away from Vaishno Devi Yatra registration counter.
        </p>
        <div className="mt-5 mx-auto w-16 h-1 rounded-full bg-amber-500" />
      </div>

      {/* Facilities Grid */}
      <div className="max-w-5xl mx-auto mb-14 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {facilities.map((f) => (
            <div key={f.label} className="group flex flex-col items-center gap-2 bg-white hover:bg-amber-50/90 rounded-2xl p-4 sm:p-5 transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:shadow-md">
              <div className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center transition-colors">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Room Showcase Carousel */}
      <div className="max-w-7xl mx-auto relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {/* Control bar */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 bg-amber-400 px-3.5 py-1.5 rounded-full shadow-sm">
                  Featured Rooms ({currentIndex + 1}/{displayRooms.length})
                </span>
                <span className="hidden sm:inline-block text-xs text-gray-400">
                  Swipe or click arrows to view
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrev} aria-label="Previous room" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={handleNext} aria-label="Next room" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Slider track */}
            <div
              className="overflow-hidden py-2 px-1 rounded-3xl touch-pan-y"
              ref={scrollContainerRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {displayRooms.map((room, idx) => {
                  const imgSrc = room.imageUrl || room.image || "/hotel-room.png";
                  const whatsappMsg = encodeURIComponent(`Hi KK Tour & Travel, I would like to book the ${room.name} (${room.price} ${room.priceNote || "per night"}).`);
                  return (
                    <div
                      key={room.id || idx}
                      className="w-full flex-shrink-0 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Room Image Container */}
                      <div
                        className="relative h-60 sm:h-72 bg-gray-900 overflow-hidden cursor-pointer group/img"
                        onClick={() => setZoomRoom({ url: imgSrc, title: room.name, price: room.price, priceNote: room.priceNote })}
                      >
                        <Image
                          src={imgSrc}
                          alt={room.name}
                          fill
                          className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                          unoptimized={Boolean(room.imageUrl)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Badge overlay */}
                        {room.badge && (
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-500 text-gray-950 text-[11px] sm:text-xs font-extrabold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-md z-10">
                            {room.badge}
                          </div>
                        )}

                        {/* Zoom Cue Indicator */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all shadow-md z-10">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                          <span>Click to Zoom</span>
                        </div>

                        {/* Title & Price overlay */}
                        <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 flex items-end justify-between text-white gap-2">
                          <h3 className="text-lg sm:text-2xl font-extrabold drop-shadow-md leading-snug truncate">
                            {room.name}
                          </h3>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl sm:text-3xl font-black text-amber-400 drop-shadow-md">{room.price}</span>
                            <span className="block text-[10px] sm:text-xs text-white/80">/ {room.priceNote || "per night"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {(room.features || []).map((feat) => (
                              <span key={feat} className="inline-flex items-center gap-1 bg-amber-50/80 border border-amber-200/60 rounded-lg px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-gray-700">
                                <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <a
                            href={`https://wa.me/918082069080?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Book on WhatsApp
                          </a>
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-5 rounded-xl transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
                          >
                            Enquire
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {displayRooms.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to room ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === idx ? "w-8 h-2.5 bg-amber-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SHOW ALL ROOMS BUTTON ── */}
        <div className="mt-12 text-center">
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-amber-500 text-white hover:text-gray-950 font-bold text-sm sm:text-base py-3.5 px-8 sm:px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Show All Rooms</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomRoom && (
        <ImageZoomModal
          imageUrl={zoomRoom.url}
          title={zoomRoom.title}
          price={zoomRoom.price}
          priceNote={zoomRoom.priceNote}
          onClose={() => setZoomRoom(null)}
        />
      )}

      {/* Quick Enquiry Modal */}
      {selectedRoom && <QuickEnquiryModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </section>
  );
}

function ImageZoomModal({
  imageUrl,
  title,
  price,
  priceNote,
  onClose,
}: {
  imageUrl: string;
  title: string;
  price?: string;
  priceNote?: string;
  onClose: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const whatsappMsg = encodeURIComponent(
    `Hi KK Tour & Travel, I am interested in booking the ${title} (${price || ""} ${priceNote || ""}).`
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div className="relative z-10 max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 flex items-center justify-between bg-gray-950/90 border-b border-gray-800">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Room View
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white truncate max-w-xs sm:max-w-md">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-all border border-gray-700 flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isZoomed ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"} />
              </svg>
              <span>{isZoomed ? "Reset Zoom" : "Zoom 1.5x"}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer border border-gray-700"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50 min-h-[300px] sm:min-h-[420px]">
          <div
            className={`relative transition-transform duration-300 ease-out cursor-zoom-in ${
              isZoomed ? "scale-150 sm:scale-175 my-12" : "scale-100 max-w-full"
            }`}
            onClick={() => setIsZoomed((prev) => !prev)}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[60vh] w-auto object-contain rounded-2xl shadow-2xl mx-auto"
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-gray-950/95 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {price && (
            <div>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{price}</span>
              <span className="text-xs text-gray-400 ml-1.5">/ {priceNote || "per night"}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/918082069080?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:scale-105"
            >
              Book on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickEnquiryModal({ room, onClose }: { room: Room; onClose: () => void; }) {
  const [formData, setFormData] = useState({ name: "", phone: "", checkin: "", guests: "2" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi KK Tour & Travel,\n\nI want to enquire about booking:\n🏨 Room: ${room.name} (${room.price})\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n📅 Check-in: ${formData.checkin || "Not specified"}\n👥 Guests: ${formData.guests}`;
    window.open(`https://wa.me/918082069080?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden">
        <div className="bg-gray-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">✕</button>
          <span className="text-xs uppercase text-amber-400 font-bold tracking-widest">Enquiry Request</span>
          <h3 className="text-xl font-bold mt-1">{room.name}</h3>
          <p className="text-xs text-gray-300 mt-1">{room.price} / {room.priceNote || "per night"}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Your Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number *</label>
            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Check-in</label>
              <input type="date" value={formData.checkin} onChange={(e) => setFormData({ ...formData, checkin: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Guests</label>
              <input type="number" min="1" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer">Send WhatsApp Enquiry</button>
        </form>
      </div>
    </div>
  );
}
