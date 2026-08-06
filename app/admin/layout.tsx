import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | KK Tour & Travel",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // This layout removes the main site Navbar/Footer for admin pages
  return children;
}
