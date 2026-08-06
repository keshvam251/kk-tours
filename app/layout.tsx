import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kkkatra.com"),
  title: {
    default: "KK Tours and Travels Katra | Journey to Divinity",
    template: "%s | KK Tours and Travels Katra",
  },
  description:
    "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel bookings, and cab services.",
  keywords: [
    "KK Tours",
    "KK Tours Katra",
    "Vaishno Devi Yatra",
    "Kashmir Tour Packages",
    "Katra Hotel Booking",
    "Jammu Kashmir Travel",
  ],
  authors: [{ name: "KK Tours & Travels Katra" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "KK Tours and Travels Katra | Journey to Divinity",
    description:
      "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel bookings, and cab services.",
    url: "https://www.kkkatra.com",
    siteName: "KK Tours and Travels Katra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "KK Tours and Travels Katra Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KK Tours and Travels Katra | Journey to Divinity",
    description:
      "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel bookings, and cab services.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
