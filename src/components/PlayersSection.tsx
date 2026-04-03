import { useState } from "react";
import player1 from "@/assets/player-1.jpg";
import player2 from "@/assets/player-2.jpg";
import player3 from "@/assets/player-3.jpg";

const tabs = ["MAIN TEAM", "ACADEMY TEAM 1", "ACADEMY TEAM 2"];

const players = [
  { name: "Marcus Rivera", position: "Forward", image: player1, number: 1 },
  { name: "James Chen", position: "Midfielder", image: player2, number: 2 },
  { name: "Leo Santos", position: "Defender", image: player3, number: 3 },
];

const PlayersSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="players" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">Main Team</h2>

        <div className="flex flex-wrap gap-3 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`font-heading text-xs tracking-wider px-4 py-2 border transition-colors ${
                activeTab === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player.number} className="group relative overflow-hidden rounded-lg bg-card border border-border">
              <div className="relative">
                <img src={player.image} alt={player.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={600} height={800} />
                <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground font-heading text-lg font-bold w-10 h-10 flex items-center justify-center">
                  {player.number}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg font-bold text-foreground">{player.name}</h3>
                <p className="text-sm text-muted-foreground">{player.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayersSection;
