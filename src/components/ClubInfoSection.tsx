import { MapPin, Users, Calendar, Target } from "lucide-react";
import tigerLogo from "@/assets/tiger-logo.png";

const ClubInfoSection = () => {
  return (
    <section id="club-info" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-10">
          CLUB INFO
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={tigerLogo} alt="TTS" className="w-16 h-16" />
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  THE TIGER SQUAD
                </h3>
                <p className="text-sm text-muted-foreground">FOOTBALL CLUB</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The Tiger Squad Football Club is a competitive football organization 
              dedicated to developing talent, building team spirit, and achieving 
              excellence in every tournament we participate in.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Est. 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">3 Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">3 Tournaments</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">
              OUR TEAMS
            </h3>
            {[
              { name: "Main Team", desc: "Senior competitive squad" },
              { name: "Academy Team", desc: "Development & training squad" },
              { name: "Youth Team", desc: "Young rising stars" },
            ].map((team) => (
              <div
                key={team.name}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary transition-colors"
              >
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    {team.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{team.desc}</p>
                </div>
                <span className="text-xs font-heading tracking-wider text-primary">
                  VIEW →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubInfoSection;
