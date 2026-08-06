import type { Metadata } from "next";
import GalleryPageContent from "./GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery | KK Tour & Travel — Katra, Jammu & Kashmir",
  description:
    "Explore stunning photos from our tours across Kashmir, Vaishno Devi, Gulmarg, Pahalgam, Sonamarg, Leh Ladakh, and more. KK Tour & Travel gallery.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
