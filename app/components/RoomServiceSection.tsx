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
}

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
  const [activeRoom, setActiveRoom] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error loading rooms for homepage:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFirebaseRooms();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="rooms">
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <span className="inline-block text-amber-500 font-semibold text-sm tracking-widest uppercase mb-3">
          Stay With Us
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          Best Night Stay in Katra
        </h2>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Comfortable rooms with every facility you need — just steps away from
          Vaishno Devi Bhawan. Rest well before and after your yatra.
        </p>
        <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
      </div>

      {/* ── Facilities Grid ── */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {facilities.map((f) => (
            <div
              key={f.label}
              className="group flex flex-col items-center gap-2 bg-gray-50 hover:bg-amber-50 rounded-xl p-5 transition-all duration-300 border border-gray-100 hover:border-amber-200"
            >
              <div className="text-gray-400 group-hover:text-amber-500 transition-colors duration-300">
                {f.icon}
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 text-center transition-colors duration-300">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Room Cards ── */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-gray-50 rounded-3xl h-64 animate-pulse border border-gray-100" />
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100 max-w-lg mx-auto px-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Rooms Available Currently</h3>
            <p className="text-gray-500 text-xs mb-4">Rooms managed from the Admin Panel will be shown here.</p>
            <a
              href="https://wa.me/918082069080?text=Hi%2C%20I%20want%20to%20enquire%20about%20room%20availability%20in%20Katra."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-5 py-2 rounded-full text-xs transition-all shadow-sm"
            >
              Enquire Room Availability on WhatsApp
            </a>
          </div>
        ) : (
          <>
            {/* Room type tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {rooms.map((room, index) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(index)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeRoom === index
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>

            {/* Active room detail */}
            {rooms[activeRoom] && (
              <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-72 sm:h-80 lg:h-full min-h-[320px] bg-gray-900">
                    <Image
                      src={rooms[activeRoom].imageUrl || rooms[activeRoom].image || "/hotel-room.png"}
                      alt={rooms[activeRoom].name}
                      fill
                      className="object-cover transition-opacity duration-500"
                      unoptimized={Boolean(rooms[activeRoom].imageUrl)}
                    />
                    {rooms[activeRoom].badge && (
                      <div className="absolute top-5 left-5 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {rooms[activeRoom].badge}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {rooms[activeRoom].name}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {rooms[activeRoom].description}
                    </p>

                    {/* Features tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(rooms[activeRoom].features || []).map((feat) => (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-200"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-emerald-500"
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

                    {/* Price + CTA */}
                    <div className="flex items-end justify-between flex-wrap gap-4">
                      <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                          {rooms[activeRoom].price}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          / {rooms[activeRoom].priceNote || "per night"}
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/918082069080?text=Hi%2C%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(rooms[activeRoom].name)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Book on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
