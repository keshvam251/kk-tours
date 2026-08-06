import HeroSection from "./components/HeroSection";
import BannerSection from "./components/BannerSection";
import DestinationsSection from "./components/DestinationsSection";
import RoomServiceSection from "./components/RoomServiceSection";
import ReviewsSection from "./components/ReviewsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DestinationsSection />
      <BannerSection />
      <RoomServiceSection />
      <ReviewsSection />
    </>
  );
}
