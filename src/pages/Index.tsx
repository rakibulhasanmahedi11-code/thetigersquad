import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import NextMatchSection from "@/components/NextMatchSection";
import LatestNewsSection from "@/components/LatestNewsSection";
import PlayersSection from "@/components/PlayersSection";
import FixturesSection from "@/components/FixturesSection";
import TrophySection from "@/components/TrophySection";
import StoreSection from "@/components/StoreSection";
import StadiumSection from "@/components/StadiumSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <NextMatchSection />
      <LatestNewsSection />
      <PlayersSection />
      <FixturesSection />
      <TrophySection />
      <StoreSection />
      <StadiumSection />
      <FooterSection />
    </div>
  );
};

export default Index;
