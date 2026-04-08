import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Shuffle } from "lucide-react";

const LiveDrawPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 text-center">
        <div className="py-20">
          <Shuffle className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">LIVE DRAW</h1>
          <p className="text-muted-foreground text-lg">Coming Soon</p>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
);

export default LiveDrawPage;
