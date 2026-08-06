import type { Metadata } from "next";
import RoomsPageContent from "./RoomsPageContent";

export const metadata: Metadata = {
  title: "Rooms & Stay | KK Tour & Travel — Katra, Jammu & Kashmir",
  description:
    "Book comfortable and affordable rooms in Katra near Vaishno Devi. Deluxe rooms, family suites, and standard rooms with all modern amenities. KK Tour & Travel.",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
