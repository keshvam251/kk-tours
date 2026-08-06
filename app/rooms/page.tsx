import type { Metadata } from "next";
import RoomsPageContent from "./RoomsPageContent";

export const metadata: Metadata = {
  title: "Rooms & Home Stay | KK International Tours & Travels & Home Stay",
  description:
    "Book comfortable rooms and home stays in Katra near Vaishno Devi. Deluxe rooms, family suites, and standard rooms with all modern amenities. KK International.",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
