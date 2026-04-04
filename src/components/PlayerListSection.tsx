import { useState } from "react";
import { User, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const teamOptions = [
  { key: "main_team" as const, label: "MAIN TEAM" },
  { key: "academy_team" as const, label: "ACADEMY TEAM" },
  { key: "youth_team" as const, label: "YOUTH TEAM" },
];

const teamDisplayName: Record<string, string> = {
  main_team: "Main Team",
  academy_team: "Academy Team",
  youth_team: "Youth Team",
};

const PlayerListSection = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players", selectedTeam],
    queryFn: async () => {
      let query = supabase.from("players").select("*").order("name");
      if (selectedTeam) {
        query = query.eq("team", selectedTeam);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTeam,
  });

  return (
    <section id="players" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
          PLAYERS
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          Browse players from Main Team, Academy Team & Youth Team.
        </p>

        {!selectedTeam ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamOptions.map((team) => (
              <button
                key={team.key}
                onClick={() => setSelectedTeam(team.key)}
                className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-left"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {team.label}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  View Players <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setSelectedTeam(null)}
                className="font-heading text-xs tracking-wider px-4 py-2 border border-border bg-transparent text-muted-foreground hover:border-primary transition-colors"
              >
                ← BACK
              </button>
              {teamOptions.map((team) => (
                <button
                  key={team.key}
                  onClick={() => setSelectedTeam(team.key)}
                  className={`font-heading text-xs tracking-wider px-4 py-2 border transition-colors ${
                    selectedTeam === team.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {team.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full mb-3" />
                    <div className="h-4 bg-muted rounded mx-auto w-24 mb-2" />
                    <div className="h-3 bg-muted rounded mx-auto w-16" />
                  </div>
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No players in this team yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => navigate(`/player/${player.id}`)}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-border group-hover:border-primary transition-colors">
                      {player.photo_url ? (
                        <img
                          src={player.photo_url}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <User className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-sm font-bold text-foreground text-center">
                      {player.name}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Age: {player.age}
                    </p>
                    <p className="text-xs text-primary text-center mt-1 font-heading tracking-wider">
                      {teamDisplayName[player.team]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PlayerListSection;
