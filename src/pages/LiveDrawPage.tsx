import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Shuffle, Trophy, Clock, Star } from "lucide-react";

const typeIcons: Record<string, any> = { league: Shuffle, champions_league: Star, trophy: Clock };

const LiveDrawPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const { data } = await supabase.from("tournaments").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: drawResults = [] } = useQuery({
    queryKey: ["draw-results", selected],
    queryFn: async () => {
      if (!selected) return [];
      const { data } = await supabase.from("draw_results").select("*").eq("tournament_id", selected).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selected,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">LIVE DRAW</h1>
          <p className="text-muted-foreground text-sm mb-10 max-w-md">Watch live draws for tournament matchups, group stages, and knockout rounds.</p>

          {/* Tournament selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tournaments.length === 0 ? (
              <>
                {[{ name: "TTS League Draw", icon: Shuffle, desc: "Live draw for league fixtures.", color: "bg-primary" },
                  { name: "Champions League Draw", icon: Trophy, desc: "Group stage and knockout round draw.", color: "bg-accent" },
                  { name: "TTS Trophy Draw", icon: Clock, desc: "Knockout cup draw — random matchup.", color: "bg-secondary" }
                ].map(d => (
                  <div key={d.name} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group">
                    <div className={`w-14 h-14 ${d.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <d.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{d.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                    <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">Coming Soon</span>
                  </div>
                ))}
              </>
            ) : tournaments.map((t: any) => {
              const Icon = typeIcons[t.type] || Shuffle;
              return (
                <div key={t.id} onClick={() => setSelected(t.id)}
                  className={`bg-card border rounded-lg p-6 hover:border-primary transition-colors group cursor-pointer ${selected === t.id ? "border-primary" : "border-border"}`}>
                  <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t.name} Draw</h3>
                  <p className="text-sm text-muted-foreground mb-2">{t.season} • {t.year}</p>
                  <span className="inline-block text-xs font-heading tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">{t.status}</span>
                </div>
              );
            })}
          </div>

          {/* Draw Results */}
          {selected && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">DRAW RESULTS</h3>
              {drawResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No DATA AVAILABLE — Draw will be available from Admin Panel</p>
              ) : (
                <div className="space-y-3">
                  {drawResults.map((d: any) => (
                    <div key={d.id} className="bg-background border border-border rounded-lg p-4">
                      <p className="text-sm font-heading font-bold text-foreground">{d.round || "Round"} — {d.draw_type.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default LiveDrawPage;
