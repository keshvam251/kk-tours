"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Gallery Item Types ─── */
interface GalleryItem {
  id: string | number;
  title: string;
  location: string;
  category: string;
  imageUrl?: string;
  gradient?: string;
  badge?: string;
}

/* ─── Sample Fallback Gallery Photos ─── */
const SAMPLE_GALLERY: GalleryItem[] = [
  {
    id: "sample-g1",
    title: "Dal Lake Shikara Ride & Sunset",
    location: "Srinagar, Kashmir",
    category: "Kashmir",
    imageUrl: "/peakpx.jpg",
    badge: "Popular",
  },
  {
    id: "sample-g2",
    title: "Holy Mata Vaishno Devi Shrine",
    location: "Katra, Jammu",
    category: "Vaishno Devi",
    imageUrl: "/hotel-exterior.png",
    badge: "Sacred Yatra",
  },
  {
    id: "sample-g3",
    title: "Gulmarg Snow Peaks & Cable Car",
    location: "Gulmarg, Kashmir",
    category: "Adventures",
    imageUrl: "/hotel-room.png",
    badge: "Must Visit",
  },
  {
    id: "sample-g4",
    title: "KK Luxury Hotel & Room Stay",
    location: "Katra Town",
    category: "Hotels",
    imageUrl: "/hotel-room.png",
    badge: "Top Stay",
  },
  {
    id: "sample-g5",
    title: "Sonamarg Valley & Glacier Stream",
    location: "Sonamarg, Kashmir",
    category: "Kashmir",
    imageUrl: "/peakpx.jpg",
    badge: "Scenic",
  },
];

const categories = ["All", "Kashmir", "Vaishno Devi", "Hotels", "Adventures"];

export default function GalleryPageContent() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFullViewModal, setShowFullViewModal] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function loadFirebaseGallery() {
      try {
        const q = query(collection(db, "gallery"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const dbData = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as GalleryItem[];
          setItems(dbData);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadFirebaseGallery();
  }, []);

  const displayItems = items.length > 0 ? items : SAMPLE_GALLERY;

  // Auto moving slideshow timer
  useEffect(() => {
    if (isPaused || displayItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, displayItems.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);

  const filteredFullItems =
    activeCategory === "All"
      ? displayItems
      : displayItems.filter((i) => i.category === activeCategory);

  return (
    <main className="bg-white relative">
      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="relative h-[45vh] sm:h-[55vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/peakpx.jpg"
          alt="Gallery — KK Tour & Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 bg-amber-500/20 px-4 py-1 rounded-full border border-amber-400/30">
            📸 Captured Moments
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
            Tour &amp; Travel Gallery
          </h1>
          <p className="mt-4 text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            Experience breathtaking glimpses of Kashmir and Katra in our moving image slideshow.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. MOVING GALLERY SLIDESHOW SECTION
         ════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden" id="gallery-slideshow">
        <div className="max-w-5xl mx-auto">
          {/* Section Heading & View All Button Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <span className="text-amber-700 font-extrabold text-xs uppercase tracking-widest bg-amber-100/90 border border-amber-300/60 px-3.5 py-1 rounded-full shadow-sm inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Our Gallery
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
                Lovely Memories
              </h2>
            </div>

            {/* SINGLE VIEW ALL BUTTON */}
            <button
              onClick={() => setShowFullViewModal(true)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer text-xs sm:text-sm shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>View All Photos ({displayItems.length})</span>
            </button>
          </div>

          {loading ? (
            <div className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slideshow Counter & Controls */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                  Photo {currentIndex + 1} of {displayItems.length} (Auto-moving)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-white hover:bg-amber-500 text-gray-800 hover:text-gray-950 border border-gray-200 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    aria-label="Next photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Compact Moving Slideshow Frame */}
              <div className="overflow-hidden rounded-2xl shadow-xl bg-gray-900 border border-gray-200">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {displayItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="w-full flex-shrink-0 relative aspect-[16/8] sm:aspect-[21/9] min-h-[250px] max-h-[380px] cursor-pointer group"
                      onClick={() => setLightboxItem(item)}
                    >
                      <Image
                        src={item.imageUrl || "/peakpx.jpg"}
                        alt={`${item.title} - Jammu & Kashmir Tour - KK Tour & Travel`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized={Boolean(item.imageUrl)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                        <span className="bg-amber-500 text-gray-950 text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between gap-2 z-10">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-amber-300 font-bold mb-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            {item.location}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                            {item.title}
                          </h3>
                        </div>

                        <span className="text-xs text-amber-300 font-semibold bg-black/50 px-3 py-1.5 rounded-full border border-white/10 shrink-0 w-fit">
                          Click photo to enlarge
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {displayItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${currentIndex === idx
                        ? "w-8 h-3 bg-amber-500 shadow-md"
                        : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Centered Secondary View All Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowFullViewModal(true)}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white hover:text-gray-950 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl cursor-pointer transform hover:scale-105"
            >
              <span>Explore All Gallery Photos</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. FULL GALLERY VIEW MODAL (Triggered by View All Button)
         ════════════════════════════════════════════════════════ */}
      {showFullViewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 my-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase text-amber-500 tracking-widest">
                  Full Gallery Collection
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  All Photos ({filteredFullItems.length})
                </h3>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowFullViewModal(false)}
                className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filter Tabs inside Modal */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeCategory === cat
                      ? "bg-amber-500 text-gray-950 shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFullItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3] bg-gray-900"
                >
                  <Image
                    src={item.imageUrl || "/peakpx.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={Boolean(item.imageUrl)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-amber-500 text-gray-950 text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-base font-bold drop-shadow-md">{item.title}</h4>
                    <p className="text-xs text-white/80">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowFullViewModal(false)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-full text-sm transition-all"
              >
                Close Full Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          4. LIGHTBOX PREVIEW MODAL
         ════════════════════════════════════════════════════════ */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </main>
  );
}

/* ─── Lightbox Component ─── */
function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[16/10] bg-gray-950">
          <Image
            src={item.imageUrl || "/peakpx.jpg"}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized={Boolean(item.imageUrl)}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{item.location}</p>
          </div>
          <a
            href={`https://wa.me/918082069080?text=${encodeURIComponent(`Hi, I am interested in visiting ${item.title} (${item.location}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-2.5 px-6 rounded-full text-sm shadow-md transition-all"
          >
            Plan Trip on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

