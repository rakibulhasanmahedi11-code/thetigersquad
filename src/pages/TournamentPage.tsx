import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Trophy, Star, Award, Calendar } from "lucide-react";

const typeIcons: Record<string, any> = { league: Trophy, champions_league: Star, trophy: Award };
const typeColors: Record<string, string> = { league: "bg-primary", champions_league: "bg-accent", trophy: "bg-secondary" };

const TournamentPage = () => {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const { data } = await supabase.from("tournaments").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: standings = [] } = useQuery({
    queryKey: ["standings", selectedTournament],
    queryFn: async () => {
      if (!selectedTournament) return [];
      const { data } = await supabase.from("tournament_standings").select("*, players(name)").eq("tournament_id", selectedTournament).order("points", { ascending: false });
      return data || [];
    },
    enabled: !!selectedTournament,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">TOURNAMENTS</h1>
          <p className="text-muted-foreground text-sm mb-10 max-w-md">Compete in official TTS tournaments across multiple formats.</p>

          {/* Tournament Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tournaments.length === 0 ? (
              <>
                {[{ name: "TTS League", type: "league", desc: "Round-robin league format. Win = 3pts, Draw = 1pt." },
                  { name: "TTS Champions League", type: "champions_league", desc: "Group Stage + Knockout rounds with Live Draw." },
                  { name: "TTS Trophy", type: "trophy", desc: "Knockout cup competition for all teams." }
                ].map(t => {
                  const Icon = typeIcons[t.type] || Trophy;
                  return (
                    <div key={t.name} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group">
                      <div className={`w-14 h-14 ${typeColors[t.type]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                      <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">Coming Soon</span>
                    </div>
                  );
                })}
              </>
            ) : tournaments.map((t: any) => {
              const Icon = typeIcons[t.type] || Trophy;
              return (
                <div key={t.id} onClick={() => setSelectedTournament(t.id)}
                  className={`bg-card border rounded-lg p-6 hover:border-primary transition-colors group cursor-pointer ${selectedTournament === t.id ? "border-primary" : "border-border"}`}>
                  <div className={`w-14 h-14 ${typeColors[t.type] || "bg-primary"} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{t.season} • {t.year}</p>
                  <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">{t.status}</span>
                </div>
              );
            })}
          </div>

          {/* Scoreboard */}
          {selectedTournament && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-heading text-lg font-bold text-foreground">SCOREBOARD</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Player</th>
                      <th className="text-center p-3">M</th>
                      <th className="text-center p-3">W</th>
                      <th className="text-center p-3">D</th>
                      <th className="text-center p-3">L</th>
                      <th className="text-center p-3">GD</th>
                      <th className="text-center p-3 text-primary">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</td></tr>
                    ) : standings.map((s: any, i: number) => (
                      <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3 font-bold">{i + 1}</td>
                        <td className="p-3 font-heading font-bold text-foreground">{s.players?.name || "—"}</td>
                        <td className="text-center p-3">{s.matches}</td>
                        <td className="text-center p-3">{s.wins}</td>
                        <td className="text-center p-3">{s.draws}</td>
                        <td className="text-center p-3">{s.losses}</td>
                        <td className="text-center p-3">{s.goals_for - s.goals_against}</td>
                        <td className="text-center p-3 font-bold text-primary">{s.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 flex gap-4 text-xs text-muted-foreground border-t border-border">
                <span>W = 3pts</span><span>D = 1pt</span><span>L = 0pt</span>
              </div>
            </div>
          )}

          {/* Fixture placeholder */}
          <div className="mt-12 bg-card border border-border rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">FIXTURE</h3>
            <p className="text-muted-foreground text-sm">No fixture data available</p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default TournamentPage;
