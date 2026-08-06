import type { Metadata } from "next";
import GalleryPageContent from "./GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery | KK International Tours & Travels & Home Stay",
  description:
    "Explore stunning photos from our tours across Kashmir, Vaishno Devi, Gulmarg, Pahalgam, Sonamarg, Leh Ladakh, and more. KK International gallery.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
