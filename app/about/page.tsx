import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | KK Tour & Travel — Katra, Jammu & Kashmir",
  description:
    "Learn about KK Tour & Travel, your trusted travel partner in Katra for Vaishno Devi yatra, Kashmir tours, and comfortable stays since years.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
