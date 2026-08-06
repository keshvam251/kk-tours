import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | KK Tour & Travel — Katra, Jammu & Kashmir",
  description:
    "Get in touch with KK Tour & Travel for Vaishno Devi yatra packages, Kashmir tours, hotel bookings, and cab services. Call us at +91 96972 58667.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
