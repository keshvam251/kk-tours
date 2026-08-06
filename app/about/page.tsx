import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | KK International Tours & Travels & Home Stay",
  description:
    "Learn about KK International Tours and Travels and Home Stay, your trusted travel partner in Katra for Vaishno Devi yatra, Kashmir tours, and comfortable stays.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
