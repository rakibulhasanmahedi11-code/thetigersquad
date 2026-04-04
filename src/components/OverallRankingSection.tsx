import { Medal } from "lucide-react";

const rankingData = [
  { rank: 1, name: "Player 1", team: "Main", pts: 15, gd: 8, wins: 5, gf: 12 },
  { rank: 2, name: "Player 2", team: "Academy", pts: 12, gd: 5, wins: 4, gf: 10 },
  { rank: 3, name: "Player 3", team: "Main", pts: 10, gd: 4, wins: 3, gf: 9 },
  { rank: 4, name: "Player 4", team: "Youth", pts: 9, gd: 3, wins: 3, gf: 7 },
  { rank: 5, name: "Player 5", team: "Academy", pts: 7, gd: 1, wins: 2, gf: 6 },
];

const getRankBadge = (rank: number) => {
  if (rank === 1) return "bg-primary text-primary-foreground";
  if (rank === 2) return "bg-muted-foreground/30 text-foreground";
  if (rank === 3) return "bg-gold-dark text-primary-foreground";
  return "bg-muted text-muted-foreground";
};

const OverallRankingSection = () => {
  return (
    <section id="ranking" className="py-16 bg-purple-surface">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Medal className="w-8 h-8 text-primary" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            OVERALL RANKING
          </h2>
        </div>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Combined rankings from TTS League, Champions League & Trophy. Sorted by Points → GD → Wins → GF.
        </p>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-2 p-4 border-b border-border text-xs font-heading tracking-wider text-muted-foreground">
            <span>#</span>
            <span className="col-span-2">PLAYER</span>
            <span>TEAM</span>
            <span className="text-center">PTS</span>
            <span className="text-center">GD</span>
            <span className="text-center">W</span>
          </div>

          {rankingData.map((player) => (
            <div
              key={player.rank}
              className="grid grid-cols-7 gap-2 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors items-center"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadge(
                  player.rank
                )}`}
              >
                {player.rank}
              </span>
              <span className="col-span-2 font-heading text-sm font-bold text-foreground">
                {player.name}
              </span>
              <span className="text-xs text-muted-foreground">{player.team}</span>
              <span className="text-center font-heading text-sm font-bold text-primary">
                {player.pts}
              </span>
              <span className="text-center text-sm text-foreground">{player.gd}</span>
              <span className="text-center text-sm text-foreground">{player.wins}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span>W = Wins (3pts)</span>
          <span>D = Draw (1pt)</span>
          <span>L = Loss (0pt)</span>
        </div>
      </div>
    </section>
  );
};

export default OverallRankingSection;
