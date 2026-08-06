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

export default function RoomServiceSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
    if (isPaused || displayRooms.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, displayRooms.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayRooms.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayRooms.length) % displayRooms.length);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden" id="rooms">
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-14 relative z-10">
        <span className="inline-flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-100/70 border border-amber-200 px-4 py-1.5 rounded-full mb-3 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Moving Cards Experience
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
          Best Night Stay in Katra
        </h2>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Watch our room cards move dynamically! Scroll, swipe, or click any card to inspect room features and book instantly on WhatsApp.
        </p>
        <div className="mt-5 mx-auto w-16 h-1 rounded-full bg-amber-500" />
      </div>

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

      <div className="max-w-7xl mx-auto relative z-10">
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => <div key={i} className="w-[340px] sm:w-[400px] h-[450px] bg-gray-200 rounded-3xl animate-pulse flex-shrink-0" />)}
          </div>
        ) : (
          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-900 bg-amber-400 px-3.5 py-1.5 rounded-full shadow-sm">
                  ⚡ Live Moving Cards ({currentIndex + 1}/{displayRooms.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrev} className="w-11 h-11 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={handleNext} className="w-11 h-11 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="overflow-hidden py-2 px-1 rounded-3xl" ref={scrollContainerRef}>
              <div className="flex transition-transform duration-700 ease-out gap-6" style={{ transform: `translateX(-${currentIndex * (typeof window !== "undefined" && window.innerWidth >= 1024 ? 50 : 100)}%)` }}>
                {displayRooms.map((room, idx) => {
                  const imgSrc = room.imageUrl || room.image || "/hotel-room.png";
                  const whatsappMsg = encodeURIComponent(`Hi KK Tour & Travel, I would like to book the ${room.name} (${room.price} ${room.priceNote || "per night"}).`);
                  return (
                    <div key={room.id || idx} className="w-full lg:w-[calc(50%-12px)] flex-shrink-0 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
                      <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden">
                        <Image src={imgSrc} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" unoptimized={Boolean(room.imageUrl)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {room.badge && <div className="absolute top-4 left-4 bg-amber-500 text-gray-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg">{room.badge}</div>}
                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                          <h3 className="text-xl sm:text-2xl font-extrabold drop-shadow-md">{room.name}</h3>
                          <div className="text-right">
                            <span className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-md">{room.price}</span>
                            <span className="block text-[11px] text-white/80">/ {room.priceNote || "per night"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">{room.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {(room.features || []).map((feat) => (
                              <span key={feat} className="inline-flex items-center gap-1 bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                          <a href={`https://wa.me/918082069080?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]">
                            Book on WhatsApp
                          </a>
                          <button onClick={() => setSelectedRoom(room)} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm cursor-pointer">Enquire</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              {displayRooms.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`transition-all duration-300 rounded-full cursor-pointer ${currentIndex === idx ? "w-8 h-2.5 bg-amber-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"}`} />
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedRoom && <QuickEnquiryModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </section>
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
