import { Shuffle, Clock, Trophy } from "lucide-react";

const LiveDrawSection = () => {
  return (
    <section id="live-draw" className="py-16 bg-dark-surface">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          LIVE DRAW
        </h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Watch the live draw for tournament matchups, group stages, and knockout rounds.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shuffle className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              TTS League Draw
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Live draw for league fixtures and matchday scheduling.
            </p>
            <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group">
            <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Champions League Draw
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Group stage and knockout round draw with live animation.
            </p>
            <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group">
            <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              TTS Trophy Draw
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Knockout cup draw — random matchup selection live.
            </p>
            <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDrawSection;
