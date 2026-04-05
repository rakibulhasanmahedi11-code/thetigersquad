import Navbar from "@/components/Navbar";
import PlayerListSection from "@/components/PlayerListSection";
import FooterSection from "@/components/FooterSection";

const PlayersPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <PlayerListSection />
    </div>
    <FooterSection />
  </div>
);

export default PlayersPage;
