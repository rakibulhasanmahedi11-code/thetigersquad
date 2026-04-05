import Navbar from "@/components/Navbar";
import ClubInfoSection from "@/components/ClubInfoSection";
import FooterSection from "@/components/FooterSection";

const ClubInfoPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <ClubInfoSection />
    </div>
    <FooterSection />
  </div>
);

export default ClubInfoPage;
