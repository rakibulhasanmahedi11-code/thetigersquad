import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PlayerListSection from "@/components/PlayerListSection";
import TournamentSection from "@/components/TournamentSection";
import CommunityTournamentSection from "@/components/CommunityTournamentSection";
import OverallRankingSection from "@/components/OverallRankingSection";
import ClubInfoSection from "@/components/ClubInfoSection";
import ClubRulesSection from "@/components/ClubRulesSection";
import LatestNewsSection from "@/components/LatestNewsSection";
import LoginSection from "@/components/LoginSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <PlayerListSection />
      <TournamentSection />
      <CommunityTournamentSection />
      <OverallRankingSection />
      <ClubInfoSection />
      <ClubRulesSection />
      <LatestNewsSection />
      <LoginSection />
      <FooterSection />
    </div>
  );
};

export default Index;
