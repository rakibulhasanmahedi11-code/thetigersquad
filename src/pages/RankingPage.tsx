import Navbar from "@/components/Navbar";
import OverallRankingSection from "@/components/OverallRankingSection";
import FooterSection from "@/components/FooterSection";

const RankingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <OverallRankingSection />
    </div>
    <FooterSection />
  </div>
);

export default RankingPage;
