"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Review {
  id: number;
  name: string;
  rating: number;
  timeAgo: string;
  text: string;
  initial: string;
  color: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Anil Pawar",
    rating: 5,
    timeAgo: "3 years ago",
    text: "Ankur bhai is very good person. He won't let you feel like any customer, he always treat as a family member. As well as tour management is concerned, totally awesome management. If you are looking for a nice tour with your budget, one must get in touch with him.",
    initial: "A",
    color: "bg-rose-500",
  },
  {
    id: 2,
    name: "Sumit Sharma",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Awesome trip managed by KK Tour and Travel. Thank you Mr. Sharma ji for an amazing experience!",
    initial: "S",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Mukesh Verma",
    rating: 5,
    timeAgo: "7 months ago",
    text: "Beautiful site visit done with Neeraj and calm behaviour of him. I prefer to visit again with KK Tour & Travels.",
    initial: "M",
    color: "bg-emerald-500",
  },
  {
    id: 4,
    name: "Angshuman Praharaj",
    rating: 5,
    timeAgo: "1 year ago",
    text: "Awesome travel experience with KK Tours & Travels. They had made our Kashmir trip very smooth and budget friendly. Owner of this organisation Mr. Ankur is very genuine & polite person.",
    initial: "A",
    color: "bg-violet-500",
  },
  {
    id: 5,
    name: "Shivam Kundan",
    rating: 5,
    timeAgo: "7 months ago",
    text: "Trip to Shivkhori with family — awesome experience! Driver is good and car is also good.",
    initial: "S",
    color: "bg-amber-500",
  },
  {
    id: 6,
    name: "Annu Yadav",
    rating: 5,
    timeAgo: "4 years ago",
    text: "KK Tours and Travel is the best in Katra. Ankur Ji is very helpful and will treat you as your family. They are doing business in Katra from a very long time, hence will provide you with the most accurate information on everything. Highly recommended!!",
    initial: "A",
    color: "bg-cyan-500",
  },
  {
    id: 7,
    name: "Dheeraj Sharma",
    rating: 5,
    timeAgo: "3 years ago",
    text: "Best travel in Katra. Mata Vaishno Devi — KK booked our bus to Amritsar and bus is good with affordable price. Thank you KK Tour Travel for best service in Katra. Jai Mata Di!",
    initial: "D",
    color: "bg-pink-500",
  },
  {
    id: 8,
    name: "Ajay Sharma",
    rating: 5,
    timeAgo: "2 years ago",
    text: "KK Tour & Travel is best. Ankur Sharma is a good guider. Highly recommended for anyone visiting Katra!",
    initial: "A",
    color: "bg-indigo-500",
  },
];

/* ─── Star rating ─── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < count ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Google logo SVG ─── */
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // Number of visible cards depends on screen size — we show 1 on mobile, 2 on md, 3 on lg
  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getVisibleCount]);

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, maxIndex]);

  const goTo = (dir: "prev" | "next") => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      dir === "prev"
        ? Math.max(0, prev - 1)
        : Math.min(maxIndex, prev + 1)
    );
    // Resume autoplay after 8s
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="reviews">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 mb-6">
          <GoogleIcon />
          <span className="text-sm font-semibold text-gray-700">
            Google Reviews
          </span>
          <span className="text-sm text-amber-500 font-bold">4.4 ★</span>
          <span className="text-xs text-gray-400">(87 reviews)</span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          What Our Travelers Say
        </h2>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Real reviews from real travelers who explored Jammu &amp; Kashmir with
          KK Tour &amp; Travel.
        </p>
        <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
      </div>

      {/* Carousel */}
      <div className="max-w-7xl mx-auto relative">
        {/* Navigation arrows */}
        <button
          onClick={() => goTo("prev")}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous reviews"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goTo("next")}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next reviews"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Cards container */}
        <div className="overflow-hidden mx-6" ref={containerRef}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                  {/* Header: avatar + name + stars */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-11 h-11 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                    >
                      {review.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {review.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars count={review.rating} />
                        <span className="text-xs text-gray-400">
                          {review.timeAgo}
                        </span>
                      </div>
                    </div>
                    <GoogleIcon />
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 8000);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? "w-8 h-2.5 bg-amber-500"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to review set ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
