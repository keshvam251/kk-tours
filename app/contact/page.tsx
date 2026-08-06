import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | KK International Tours & Travels & Home Stay",
  description:
    "Get in touch with KK International Tours and Travels and Home Stay for Vaishno Devi yatra packages, Kashmir tours, hotel & home stay bookings, and cab services. Call us at +91 80820 69080.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
