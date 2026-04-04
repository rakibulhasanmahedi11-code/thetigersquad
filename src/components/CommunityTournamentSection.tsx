import { Users, Shield } from "lucide-react";

const communityTournaments = [
  {
    title: "Main Team Tournament",
    description: "Official community competition for Main Team players.",
    icon: Shield,
    teams: 8,
    status: "Registration Open",
  },
  {
    title: "Academy Team Tournament",
    description: "Development tournament for Academy players to showcase talent.",
    icon: Users,
    teams: 6,
    status: "Coming Soon",
  },
];

const CommunityTournamentSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          COMMUNITY TOURNAMENT
        </h2>
        <p className="text-muted-foreground text-sm mb-2 max-w-md">
          Community events for fun & development. Stats do NOT count in official rankings.
        </p>
        <span className="inline-block text-xs font-heading tracking-wider text-destructive bg-destructive/10 px-3 py-1 rounded-full mb-10">
          NOT COUNTED IN STATS
        </span>

        <div className="grid md:grid-cols-2 gap-6">
          {communityTournaments.map((ct) => (
            <div
              key={ct.title}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <ct.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    {ct.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {ct.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{ct.teams} Teams</span>
                    <span className="text-primary font-heading tracking-wider">
                      {ct.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityTournamentSection;
