import Navbar from "@/components/Navbar";
import LatestNewsSection from "@/components/LatestNewsSection";
import FooterSection from "@/components/FooterSection";

const NewsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <LatestNewsSection />
    </div>
    <FooterSection />
  </div>
);

export default NewsPage;
