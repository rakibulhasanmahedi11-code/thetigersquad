import { Trophy, Star, Award } from "lucide-react";

const tournaments = [
  {
    name: "TTS League",
    description: "Round-robin league format. Win = 3pts, Draw = 1pt.",
    icon: Trophy,
    status: "Season 1 - Active",
    color: "bg-primary",
  },
  {
    name: "TTS Champions League",
    description: "Group Stage (2 legs) + Knockout rounds with Live Draw system.",
    icon: Star,
    status: "Coming Soon",
    color: "bg-accent",
  },
  {
    name: "TTS Trophy",
    description: "Knockout cup competition for all teams.",
    icon: Award,
    status: "Coming Soon",
    color: "bg-secondary",
  },
];

const TournamentSection = () => {
  return (
    <section id="tournament" className="py-16 bg-dark-surface">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          TOURNAMENTS
        </h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Compete in official TTS tournaments across multiple formats and stages.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group"
            >
              <div
                className={`w-14 h-14 ${t.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <t.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                {t.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.description}
              </p>
              <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentSection;
