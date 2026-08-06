import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Rooms", href: "/rooms" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Vaishno Devi Yatra",
  "Kashmir Tour Packages",
  "Hotel & Room Booking",
  "Cab & Taxi Service",
  "Airport/Station Pickup",
  "Customized Itineraries",
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <circle cx="16" cy="16" r="14" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5" />
                <ellipse cx="16" cy="16" rx="8" ry="14" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
                <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
                <g transform="translate(20,8) rotate(30)">
                  <path d="M0,0 L3,-1 L5,0 L3,1Z" fill="#fbbf24" />
                  <path d="M1,-0.5 L2,-3 L3,-0.5" fill="#fbbf24" opacity="0.8" />
                </g>
              </svg>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                KK<span className="text-amber-400">tour</span>
                <span className="text-white/50 font-normal text-sm ml-0.5">
                  travel
                </span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Your trusted travel partner in Katra for Vaishno Devi yatra, Kashmir tours, hotel bookings, and complete tour management.
            </p>
            {/* Social / WhatsApp */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919697258667?text=Hi%20Ankur%2C%20I%20want%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="tel:+919697258667"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Phone"
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a
                href="https://maps.app.goo.gl/QT1z5bLdRtCR5Uw39"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Location"
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-amber-400 text-sm transition-colors duration-300 hover:pl-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/50 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full shrink-0" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h4>
            <div className="space-y-4">
              <a
                href="tel:+919697258667"
                className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70 group-hover:text-white">+91 96972 58667</p>
                  <p className="text-xs text-white/30">Available 24/7</p>
                </div>
              </a>

              <div className="flex items-start gap-3 text-white/50">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/70">Katra, Reasi District</p>
                  <p className="text-xs text-white/30">Jammu &amp; Kashmir 182301</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/50">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/70">Open 24 Hours</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Available Now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} KK Tour &amp; Travel, Katra. All rights reserved.
          </p>
          <p className="text-white/30 text-xs text-center sm:text-right flex items-center gap-1.5">
            Developed by{" "}
            <a
              href="https://www.udyamsites.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/80 hover:text-amber-400 font-medium transition-colors duration-300"
            >
              UdyamSites
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
