"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Rooms",
    href: "/admin/rooms",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Packages",
    href: "/admin/packages",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem("kk_admin_auth");
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("kk_admin_auth", "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kk_admin_auth");
    setAuthenticated(false);
    setPassword("");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 32" className="w-10 h-10" fill="none">
                <circle cx="16" cy="16" r="14" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5" />
                <ellipse cx="16" cy="16" rx="8" ry="14" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
                <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
                <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
                <g transform="translate(20,8) rotate(30)">
                  <path d="M0,0 L3,-1 L5,0 L3,1Z" fill="#fbbf24" />
                  <path d="M1,-0.5 L2,-3 L3,-0.5" fill="#fbbf24" opacity="0.8" />
                </g>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm mt-1">KK Tour &amp; Travel</p>
          </div>

          <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-6 border border-white/10">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer text-sm"
            >
              Login
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-6">
            <Link href="/" className="hover:text-white/40 transition-colors">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Authenticated Admin Layout ──
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-white/5 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <circle cx="16" cy="16" r="14" stroke="rgba(251,191,36,0.8)" strokeWidth="1.5" />
              <ellipse cx="16" cy="16" rx="8" ry="14" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
              <g transform="translate(20,8) rotate(30)">
                <path d="M0,0 L3,-1 L5,0 L3,1Z" fill="#fbbf24" />
              </g>
            </svg>
            <span className="text-white font-bold text-lg">
              KK<span className="text-amber-400">admin</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-gray-900 border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-white font-bold">KK<span className="text-amber-400">admin</span></span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white/60 hover:text-white cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-64 bg-gray-900 border-r border-white/5 pt-16 px-3 py-4 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/5 mt-4">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Website
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 w-full cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
