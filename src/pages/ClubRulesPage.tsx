import Navbar from "@/components/Navbar";
import ClubRulesSection from "@/components/ClubRulesSection";
import FooterSection from "@/components/FooterSection";

const ClubRulesPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <ClubRulesSection />
    </div>
    <FooterSection />
  </div>
);

export default ClubRulesPage;
