"use client";

import { useState, useEffect } from "react";
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
  gradient?: string;
}

/* ─── Facility icons (SVG inline) ─── */
const facilities: { icon: React.ReactNode; label: string; desc: string }[] = [
  {
    label: "Free Wi-Fi",
    desc: "High-speed internet in all rooms",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
  },
  {
    label: "Air Conditioning",
    desc: "Climate-controlled rooms",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707" />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    label: "Hot Water 24/7",
    desc: "Round-the-clock hot water",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2c.5 3-2 5-2 8a4 4 0 108 0c0-3-2.5-5-2-8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22c-4 0-6-2-6-5 0-2 1-3 2-4" />
      </svg>
    ),
  },
  {
    label: "Room Service",
    desc: "Food delivered to your room",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 18h18M5 18v-1a7 7 0 0114 0v1M12 4v3m-4 1a4 4 0 018 0" />
      </svg>
    ),
  },
  {
    label: "Free Parking",
    desc: "Secure vehicle parking",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7h4a3 3 0 010 6H9" />
      </svg>
    ),
  },
  {
    label: "TV & Entertainment",
    desc: "LED TV with cable channels",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="13" rx="2" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8m-4-3v3" />
      </svg>
    ),
  },
  {
    label: "Clean Linen Daily",
    desc: "Fresh bedding every day",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Near Vaishno Devi",
    desc: "Steps from the yatra route",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" strokeWidth={1.5} />
      </svg>
    ),
  },
];

/* ─── Fallback Sample Rooms ─── */
const SAMPLE_ROOMS: Room[] = [
  {
    id: "sample-1",
    name: "Deluxe AC Family Room",
    description: "Spacious 4-bed room with plush bedding, split AC, smart TV, and modern attached bathroom. Ideal for families visiting Katra.",
    price: "₹1,499",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["Split AC", "4-Bed Setup", "24/7 Hot Water", "Free High-Speed Wi-Fi", "LED TV"],
    badge: "Most Popular",
  },
  {
    id: "sample-2",
    name: "Executive Double Room",
    description: "Premium king bed room with scenic mountain views, luxury linen, 24/7 room service, and work desk.",
    price: "₹1,999",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["King Bed", "Mountain View", "Split AC", "24/7 Room Service", "Breakfast Included"],
    badge: "Luxury Choice",
  },
  {
    id: "sample-3",
    name: "Super Deluxe Triple Room",
    description: "Comfortable triple occupancy room equipped with hot water shower, high speed Wi-Fi, and complimentary tea/coffee maker.",
    price: "₹1,799",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["3-Bed Setup", "Air Conditioning", "Hot Water 24/7", "Clean Daily Linen", "Elevator Access"],
    badge: "Best Value",
  },
  {
    id: "sample-4",
    name: "Standard Economy Stay",
    description: "Clean, cozy, budget-friendly room located close to Yatra slip counter and main Katra bazaar.",
    price: "₹999",
    priceNote: "per night",
    imageUrl: "/hotel-room.png",
    features: ["Double Bed", "Attached Bath", "24/7 Water", "Free Parking", "Near Yatra Slip"],
    badge: "Budget Friendly",
  },
];

export default function RoomsPageContent() {
  const [enquiryRoom, setEnquiryRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [zoomRoom, setZoomRoom] = useState<{ url: string; title: string; price?: string; priceNote?: string } | null>(null);

  // Touch Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error("Error loading rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFirebaseRooms();
  }, []);

  const displayRooms = rooms.length > 0 ? rooms : SAMPLE_ROOMS;

  // Auto slide ticker
  useEffect(() => {
    if (isPaused || displayRooms.length <= 1 || viewMode === "grid") return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, displayRooms.length, viewMode]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayRooms.length) % displayRooms.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
  };

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
    <main className="bg-white">
      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/hotel-exterior.png"
          alt="Rooms & Stay — KK Tour & Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Stay With Us
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            Rooms &amp; Accommodation
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Comfortable, clean, and affordable stays in Katra — just steps away from Vaishno Devi Bhawan.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. FACILITIES GRID
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Our Facilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything You Need
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              All our rooms come with modern amenities to ensure your stay is comfortable and worry-free.
            </p>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {facilities.map((f) => (
              <div
                key={f.label}
                className="group flex flex-col items-center gap-2 bg-gray-50 hover:bg-amber-50 rounded-xl p-6 transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:shadow-md"
              >
                <div className="text-gray-400 group-hover:text-amber-500 transition-colors duration-300">
                  {f.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center transition-colors duration-300">
                  {f.label}
                </span>
                <span className="text-xs text-gray-400 text-center hidden sm:block">
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. ROOM CARDS SHOWCASE & GRID VIEW
         ════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden" id="room-list">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-100/70 border border-amber-200 px-4 py-1.5 rounded-full inline-block mb-3">
              ✨ Available Accommodations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Our Room Types &amp; Suites
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
              Select from our wide range of clean, ventilated, and modern rooms tailored for your Katra visit. Click any photo to zoom in.
            </p>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setViewMode("slider")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                viewMode === "slider"
                  ? "bg-amber-500 text-gray-950 ring-2 ring-amber-400"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Featured Carousel View</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                viewMode === "grid"
                  ? "bg-amber-500 text-gray-950 ring-2 ring-amber-400"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Show All Rooms (Grid View)</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            /* SHOW ALL ROOMS - GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEnquiry={() => setEnquiryRoom(room)}
                  onZoom={() => setZoomRoom({
                    url: room.imageUrl || room.image || "/hotel-room.png",
                    title: room.name,
                    price: room.price,
                    priceNote: room.priceNote,
                  })}
                />
              ))}
            </div>
          ) : (
            /* CAROUSEL VIEW */
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Controls bar */}
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-900 bg-amber-400 px-3.5 py-1.5 rounded-full shadow-sm">
                  Room {currentIndex + 1} of {displayRooms.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-white hover:bg-amber-500 hover:text-gray-950 text-gray-700 border border-gray-200 transition-all flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                    aria-label="Previous room"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white hover:bg-amber-500 hover:text-gray-950 text-gray-700 border border-gray-200 transition-all flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                    aria-label="Next room"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Carousel Track */}
              <div
                className="overflow-hidden rounded-3xl p-1 touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-out gap-8"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {displayRooms.map((room) => (
                    <div key={room.id} className="w-full flex-shrink-0">
                      <RoomCard
                        room={room}
                        onEnquiry={() => setEnquiryRoom(room)}
                        onZoom={() => setZoomRoom({
                          url: room.imageUrl || room.image || "/hotel-room.png",
                          title: room.name,
                          price: room.price,
                          priceNote: room.priceNote,
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2.5 mt-8">
                {displayRooms.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentIndex === idx
                        ? "w-8 h-3 bg-amber-500 shadow-md"
                        : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Jump to room ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. WHY STAY WITH US
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              The KK Difference
            </h2>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📍",
                title: "Prime Location",
                desc: "Located in the heart of Katra, just minutes from the Vaishno Devi route, bus stand, and local markets.",
              },
              {
                icon: "💰",
                title: "Best Prices",
                desc: "Affordable rates with no hidden charges. Get the best value for clean, comfortable rooms in Katra.",
              },
              {
                icon: "⭐",
                title: "4.4★ Google Rating",
                desc: "87+ happy guests have rated us. Read our reviews and see why travelers love staying with us.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg text-center"
              >
                <span className="text-4xl group-hover:scale-110 inline-block transition-transform duration-300">
                  {item.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. CTA BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Need Help Choosing a Room?
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Call us or send a WhatsApp message — we&apos;ll help you find the perfect stay.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918082069080?text=Hi%2C%20I%20want%20to%20book%20a%20room%20in%20Katra."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 transform hover:scale-105"
            >
              Book on WhatsApp
            </a>
            <a
              href="tel:+918082069080"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-300 border border-white/20"
            >
              Call +91 80820 69080
            </a>
          </div>
        </div>
      </section>

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

      {/* ROOM ENQUIRY POPUP */}
      {enquiryRoom && (
        <RoomEnquiryPopup
          room={enquiryRoom}
          onClose={() => setEnquiryRoom(null)}
        />
      )}
    </main>
  );
}

/* ─── Room Card Component ─── */
function RoomCard({
  room,
  onEnquiry,
  onZoom,
}: {
  room: Room;
  onEnquiry: () => void;
  onZoom?: () => void;
}) {
  const imgSrc = room.imageUrl || room.image || "/hotel-room.png";

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
      {/* Image with zoom cursor */}
      <div
        className="relative h-60 sm:h-72 overflow-hidden bg-gray-900 cursor-pointer group/img"
        onClick={onZoom}
      >
        <Image
          src={imgSrc}
          alt={room.name}
          fill
          className="object-cover group-hover/img:scale-105 transition-transform duration-700"
          unoptimized={Boolean(room.imageUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {room.badge && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-500 text-gray-950 text-[11px] sm:text-xs font-extrabold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-md z-10">
            {room.badge}
          </div>
        )}

        {/* Zoom cue indicator */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all shadow-md z-10">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <span>Click to Zoom</span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 flex items-end justify-between text-white gap-2">
          <h3 className="text-lg sm:text-2xl font-extrabold drop-shadow-md leading-snug truncate">
            {room.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-xl sm:text-3xl font-black text-amber-400 drop-shadow-md">
              {room.price}
            </span>
            <span className="block text-[10px] sm:text-xs text-white/80">
              / {room.priceNote || "per night"}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
            {room.description}
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(room.features || []).map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1 bg-amber-50/80 rounded-lg px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-gray-700 border border-amber-200/60"
              >
                <svg
                  className="w-3 h-3 text-amber-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onEnquiry}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Enquiry
          </button>
          <a
            href="tel:+918082069080"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-xs sm:text-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Zoom Lightbox Component ─── */
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

/* ─── Room Enquiry Popup ─── */
function RoomEnquiryPopup({
  room,
  onClose,
}: {
  room: Room;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkin: "",
    checkout: "",
    guests: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = [
      `Hi, I'd like to enquire about a room!`,
      ``,
      `🏨 Room: ${room.name} (${room.price} ${room.priceNote || "per night"})`,
      `👤 Name: ${formData.name}`,
      `📞 Phone: ${formData.phone}`,
      formData.checkin ? `📅 Check-in: ${formData.checkin}` : "",
      formData.checkout ? `📅 Check-out: ${formData.checkout}` : "",
      formData.guests ? `👥 Guests: ${formData.guests}` : "",
      formData.message ? `💬 Note: ${formData.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918082069080?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md transform"
        style={{
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "1.5rem",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="relative px-6 py-5 rounded-t-[1.5rem] bg-gray-900"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Enquire: <span className="text-amber-300">{room.name}</span>
            </h3>
            <p className="text-white/60 text-sm mt-1">
              {room.price} / {room.priceNote || "per night"} — Your details go to WhatsApp
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer z-10"
            aria-label="Close enquiry popup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
            />
          </div>

          {/* Check-in / Check-out Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Check-in
              </label>
              <input
                type="date"
                name="checkin"
                value={formData.checkin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Check-out
              </label>
              <input
                type="date"
                name="checkout"
                value={formData.checkout}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Number of Guests
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max="10"
              placeholder="e.g. 2"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Any Special Request?
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Need early check-in, extra mattress..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.02] cursor-pointer text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Enquiry on WhatsApp
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Your details will be shared via WhatsApp for quick booking
          </p>
        </form>
      </div>
    </div>
  );
}
