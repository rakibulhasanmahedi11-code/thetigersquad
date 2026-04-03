import { Play } from "lucide-react";
import stadiumHero from "@/assets/stadium-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={stadiumHero} alt="Stadium" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16">
        <div className="max-w-2xl">
          <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none">
            <span className="text-foreground">THE</span>
            <br />
            <span className="text-primary">TIGER</span>
            <br />
            <span className="text-foreground">SQUAD</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
            Unleash the power within. Join us as we dominate the pitch and write history together.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 border border-primary text-primary font-heading text-sm tracking-wider px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors">
              <Play size={16} />
              WATCH HIGHLIGHTS
            </button>
            <button className="bg-card border border-border text-foreground font-heading text-sm tracking-wider px-6 py-3 hover:border-primary transition-colors">
              BUY TICKETS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
