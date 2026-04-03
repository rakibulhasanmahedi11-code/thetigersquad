import { useState } from "react";
import tigerLogo from "@/assets/tiger-logo.png";

const tabs = ["UPCOMING FIXTURES", "RESULTS"];
const fixtures = [
  { opponent: "FC United", date: "SAT 21 JAN", venue: "Tiger Arena", league: "Premier League", result: null },
  { opponent: "City Rovers", date: "SAT 28 JAN", venue: "Away", league: "Premier League", result: null },
  { opponent: "Royal FC", date: "WED 1 FEB", venue: "Tiger Arena", league: "Cup", result: null },
];

const FixturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="fixtures" className="py-16 bg-purple-surface">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Fixtures & Results</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          View all upcoming matches and past results for The Tiger Squad.
        </p>

        <div className="flex gap-3 mb-8">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`font-heading text-xs tracking-wider px-4 py-2 border transition-colors ${
                activeTab === i ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {fixtures.map((fixture, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <img src={tigerLogo} alt="TTS" className="w-8 h-8" loading="lazy" />
                <span className="font-heading text-sm text-foreground">THE TIGER SQUAD</span>
              </div>
              <span className="font-heading text-lg font-bold text-primary">VS</span>
              <span className="font-heading text-sm text-foreground">{fixture.opponent}</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{fixture.date}</p>
                <p className="text-xs text-muted-foreground">{fixture.venue} • {fixture.league}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
