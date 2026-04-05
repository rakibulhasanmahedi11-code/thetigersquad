import Navbar from "@/components/Navbar";
import LiveDrawSection from "@/components/LiveDrawSection";
import FooterSection from "@/components/FooterSection";

const LiveDrawPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <LiveDrawSection />
    </div>
    <FooterSection />
  </div>
);

export default LiveDrawPage;
