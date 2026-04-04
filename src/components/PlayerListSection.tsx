import { useState } from "react";
import { User } from "lucide-react";

const teams = ["ALL", "MAIN TEAM", "ACADEMY TEAM", "YOUTH TEAM"];

const players = [
  { name: "Player 1", age: 22, team: "Main Team", position: "Forward" },
  { name: "Player 2", age: 19, team: "Academy Team", position: "Midfielder" },
  { name: "Player 3", age: 24, team: "Main Team", position: "Defender" },
  { name: "Player 4", age: 17, team: "Youth Team", position: "Goalkeeper" },
  { name: "Player 5", age: 20, team: "Academy Team", position: "Forward" },
  { name: "Player 6", age: 18, team: "Youth Team", position: "Midfielder" },
];

const PlayerListSection = () => {
  const [activeTeam, setActiveTeam] = useState(0);

  const filtered =
    activeTeam === 0
      ? players
      : players.filter(
          (p) => p.team.toUpperCase() === teams[activeTeam].replace(" TEAM", " Team").toUpperCase()
        );

  return (
    <section id="players" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          PLAYERS
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          Browse players from Main Team, Academy Team & Youth Team.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {teams.map((team, i) => (
            <button
              key={team}
              onClick={() => setActiveTeam(i)}
              className={`font-heading text-xs tracking-wider px-4 py-2 border transition-colors ${
                activeTeam === i
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary"
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((player, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <User className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground text-center">
                {player.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Age: {player.age}
              </p>
              <p className="text-xs text-primary text-center mt-1 font-heading tracking-wider">
                {player.team}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayerListSection;
