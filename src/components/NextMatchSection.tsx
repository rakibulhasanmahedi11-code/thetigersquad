import tigerLogo from "@/assets/tiger-logo.png";

const NextMatchSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">NEXT MATCH</h2>
        <p className="text-primary text-sm font-heading tracking-wider mb-8">PREMIER LEAGUE</p>

        <div className="bg-card border border-border rounded-lg p-6 md:p-8 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={tigerLogo} alt="TTS" className="w-12 h-12" loading="lazy" />
              <div>
                <p className="font-heading text-sm font-bold text-foreground">THE TIGER SQUAD</p>
              </div>
            </div>

            <p className="font-heading text-2xl md:text-3xl font-bold text-primary">VS</p>

            <div className="text-right">
              <p className="font-heading text-sm font-bold text-foreground">FC UNITED</p>
              <p className="text-xs text-muted-foreground">FC</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">📍 Tiger Arena Stadium</p>
              <p className="text-xs text-muted-foreground">SAT 21 JAN</p>
            </div>
            <button className="bg-primary text-primary-foreground font-heading text-xs tracking-wider px-5 py-2 hover:bg-gold-dark transition-colors">
              GET TICKETS
            </button>
          </div>

          <div className="mt-4 w-full h-1 bg-gradient-to-r from-primary via-gold-dark to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default NextMatchSection;
