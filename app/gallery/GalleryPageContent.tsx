"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Gallery Items ─── */
interface GalleryItem {
  id: string | number;
  title: string;
  location: string;
  category: string;
  imageUrl?: string;
  gradient?: string;
  span?: "normal" | "tall" | "wide";
  icon?: string;
}

const categories = ["All", "Kashmir", "Vaishno Devi", "Hotels", "Adventures"];

export default function GalleryPageContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <main className="bg-white">
      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/peakpx.jpg"
          alt="Gallery — KK Tour & Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Our Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            Captured Moments
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Glimpses of unforgettable journeys across the breathtaking landscapes of Jammu &amp; Kashmir.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. CATEGORY FILTER + GALLERY GRID
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-64 border border-gray-200" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-xl mx-auto px-6">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Gallery Photos Yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Photos uploaded from the Admin Panel will appear here live. Go to <strong className="text-gray-800">/admin</strong> to upload your first photo!
              </p>
              <a
                href="/admin"
                className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md"
              >
                Go to Admin Dashboard
              </a>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {filteredItems.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. CTA BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Want to Create Your Own Memories?
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Book your dream trip and let us make it unforgettable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918082069080?text=Hi%20Ankur%2C%20I%20saw%20the%20gallery%20and%20want%20to%20plan%20a%20trip!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 transform hover:scale-105"
            >
              Plan My Trip
            </a>
            <a
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-300 border border-white/20"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LIGHTBOX MODAL
         ════════════════════════════════════════════════════════ */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </main>
  );
}

/* ─── Gallery Card ─── */
function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1 break-inside-avoid aspect-[4/3] bg-gray-900"
      onClick={onClick}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0" style={{ background: item.gradient || "linear-gradient(135deg, #1e293b, #0f172a)" }} />
      )}

      {/* Zoom icon on hover */}
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
        {item.category}
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Card content */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-lg font-bold tracking-tight leading-tight mb-0.5 drop-shadow-lg">
          {item.title}
        </h3>
        <p className="text-sm text-white/80 font-medium drop-shadow-md flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {item.location}
        </p>
      </div>
    </div>
  );
}

/* ─── Lightbox Modal ─── */
function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Large Image View */}
        <div
          className="relative w-full aspect-[16/10] bg-gray-950"
        >
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 cursor-pointer backdrop-blur-sm z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info bar */}
        <div className="bg-white px-8 py-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {item.location}
            </p>
          </div>
          <a
            href={`https://wa.me/918082069080?text=Hi%2C%20I%20am%20interested%20in%20visiting%20${encodeURIComponent(item.title)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 shrink-0"
          >
            Book This Trip
          </a>
        </div>
      </div>
    </div>
  );
}
