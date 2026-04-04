import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, ArrowLeft, Download, Trophy, Target, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";

const teamDisplayName: Record<string, string> = {
  main_team: "Main Team",
  academy_team: "Academy Team",
  youth_team: "Youth Team",
};

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ["player", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ["player-stats", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_stats")
        .select("*")
        .eq("player_id", id!)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!id,
  });

  const s = stats || {
    matches: 0, wins: 0, draws: 0, losses: 0, motm: 0,
    goals_for: 0, goals_against: 0, yellow_cards: 0, red_cards: 0,
  };

  const gd = s.goals_for - s.goals_against;
  const winRate = s.matches > 0 ? ((s.wins / s.matches) * 100).toFixed(1) : "0.0";
  const drawRate = s.matches > 0 ? ((s.draws / s.matches) * 100).toFixed(1) : "0.0";
  const lossRate = s.matches > 0 ? ((s.losses / s.matches) * 100).toFixed(1) : "0.0";

  const handleDownload = useCallback(async () => {
    if (!player) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 600, h = 900;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Gold accent line
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 0, w, 4);

    // Title
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("THE TIGER SQUAD", w / 2, 50);

    // Subtitle
    ctx.fillStyle = "#888";
    ctx.font = "12px Arial";
    ctx.fillText("PLAYER PROFILE CARD", w / 2, 72);

    // Player circle
    ctx.beginPath();
    ctx.arc(w / 2, 160, 60, 0, Math.PI * 2);
    ctx.fillStyle = "#222";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Player initial
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 40px Arial";
    ctx.fillText(player.name.charAt(0), w / 2, 175);

    // Player name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px Arial";
    ctx.fillText(player.name, w / 2, 260);

    // Team & Age
    ctx.fillStyle = "#f59e0b";
    ctx.font = "14px Arial";
    ctx.fillText(`${teamDisplayName[player.team]} • Age: ${player.age}`, w / 2, 290);

    // Divider
    ctx.fillStyle = "#333";
    ctx.fillRect(50, 320, w - 100, 1);

    // Stats section
    ctx.fillStyle = "#888";
    ctx.font = "11px Arial";
    ctx.fillText("CAREER STATISTICS", w / 2, 350);

    const statsData = [
      ["Matches", String(s.matches)],
      ["Wins", String(s.wins)],
      ["Draws", String(s.draws)],
      ["Losses", String(s.losses)],
      ["MOTM", String(s.motm)],
      ["Goals For", String(s.goals_for)],
      ["Goals Against", String(s.goals_against)],
      ["Goal Difference", String(gd)],
    ];

    let y = 390;
    statsData.forEach(([label, value]) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "#aaa";
      ctx.font = "15px Arial";
      ctx.fillText(label, 80, y);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Arial";
      ctx.fillText(value, w - 80, y);
      y += 45;
    });

    // Winning rate
    ctx.fillStyle = "#333";
    ctx.fillRect(50, y + 5, w - 100, 1);
    y += 35;
    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 36px Arial";
    ctx.fillText(`${winRate}%`, w / 2, y);
    ctx.fillStyle = "#888";
    ctx.font = "12px Arial";
    ctx.fillText("WINNING RATE", w / 2, y + 22);

    // Footer
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, h - 4, w, 4);
    ctx.fillStyle = "#555";
    ctx.font = "10px Arial";
    ctx.fillText("thetigersquad.lovable.app", w / 2, h - 15);

    // Download
    const link = document.createElement("a");
    link.download = `${player.name.replace(/\s+/g, "_")}_profile_card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [player, s, gd, winRate]);

  if (playerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center text-muted-foreground">
          Loading player...
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground">Player not found.</p>
          <Button variant="outline" onClick={() => navigate("/")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/#players")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Players
        </Button>

        {/* Player Header */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 flex-shrink-0">
              {player.photo_url ? (
                <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {player.name}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-heading">
                  {teamDisplayName[player.team]}
                </span>
                <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                  Age: {player.age}
                </span>
                {player.position && (
                  <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {player.position}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Matches", value: s.matches, icon: Shield, color: "text-primary" },
            { label: "Wins", value: s.wins, icon: Trophy, color: "text-green-500" },
            { label: "Draws", value: s.draws, icon: Target, color: "text-yellow-500" },
            { label: "Losses", value: s.losses, icon: AlertTriangle, color: "text-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Goal Stats</h3>
            <div className="space-y-4">
              {[
                { label: "Goals For (GF)", value: s.goals_for },
                { label: "Goals Against (GA)", value: s.goals_against },
                { label: "Goal Difference (GD)", value: gd, highlight: true },
                { label: "MOTM Awards", value: s.motm },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={`text-lg font-bold ${highlight ? (value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "text-foreground") : "text-foreground"}`}>
                    {highlight && value > 0 ? "+" : ""}{value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Cards & Rates</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Yellow Cards</span>
                <span className="text-lg font-bold text-yellow-500">🟨 {s.yellow_cards}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Red Cards</span>
                <span className="text-lg font-bold text-red-500">🟥 {s.red_cards}</span>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Winning Rate</span>
                  <span className="text-lg font-bold text-green-500">{winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Draw Rate</span>
                  <span className="text-lg font-bold text-yellow-500">{drawRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Losing Rate</span>
                  <span className="text-lg font-bold text-red-500">{lossRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <Button
            onClick={handleDownload}
            size="lg"
            className="gap-2 font-heading tracking-wider"
          >
            <Download className="w-5 h-5" /> DOWNLOAD PROFILE CARD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
