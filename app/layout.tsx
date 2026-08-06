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
    default: "KK International Tours and Travels and Home Stay",
    template: "%s | KK International Tours and Travels and Home Stay",
  },
  description:
    "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel & home stay bookings, and cab services.",
  keywords: [
    "KK International Tours",
    "KK International Tours and Travels and Home Stay",
    "KK Katra Home Stay",
    "Vaishno Devi Yatra",
    "Kashmir Tour Packages",
    "Katra Hotel Booking",
    "Jammu Kashmir Travel",
  ],
  authors: [{ name: "KK International Tours and Travels and Home Stay" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "KK International Tours and Travels and Home Stay",
    description:
      "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel & home stay bookings, and cab services.",
    url: "https://www.kkkatra.com",
    siteName: "KK International Tours and Travels and Home Stay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "KK International Tours and Travels and Home Stay Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KK International Tours and Travels and Home Stay",
    description:
      "Your trusted travel partner in Katra for Vaishno Devi yatra packages, Kashmir tours, hotel & home stay bookings, and cab services.",
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
