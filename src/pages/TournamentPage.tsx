import Navbar from "@/components/Navbar";
import TournamentSection from "@/components/TournamentSection";
import CommunityTournamentSection from "@/components/CommunityTournamentSection";
import FooterSection from "@/components/FooterSection";

const TournamentPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <TournamentSection />
      <CommunityTournamentSection />
    </div>
    <FooterSection />
  </div>
);

export default TournamentPage;
