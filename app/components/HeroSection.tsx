// components/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/peakpx.jpg" // ← REPLACE with your own image path
          alt="Travel destination background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
          Discover Your Next <br className="sm:hidden" />
          <span className="text-amber-300">Adventure</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-100 drop-shadow-md max-w-2xl mx-auto">
          Explore breathtaking destinations, curated tours, and unforgettable experiences tailored just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link
            href="/contact"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-full transition duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get in Touch
          </Link>
        </div>
        {/* Optional: Quick search or stats can go here */}
      </div>

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}