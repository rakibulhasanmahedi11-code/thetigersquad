import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Users, UserPlus, Trash2, Check, X, LogOut,
  Settings, Trophy, BarChart3, Newspaper, BookOpen, Info, Image
} from "lucide-react";

interface ClubAdmin {
  id: string;
  user_id: string;
  email: string;
  name: string;
  status: string;
}

interface AdminPermission {
  id: string;
  admin_id: string;
  player_control: boolean;
  tournament_control: boolean;
  result_submit: boolean;
  draw_system: boolean;
  download_system: boolean;
}

interface Player {
  id: string;
  name: string;
  age: number;
  team: string;
  position: string | null;
  photo_url: string | null;
}

interface PlayerStats {
  id: string;
  player_id: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  motm: number;
  goals_for: number;
  goals_against: number;
  yellow_cards: number;
  red_cards: number;
}

const AdminDashboard = () => {
  const { user, loading, isMainAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Club admin management
  const [clubAdmins, setClubAdmins] = useState<ClubAdmin[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);

  // Player management
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [playerTeam, setPlayerTeam] = useState("main_team");
  const [playerPosition, setPlayerPosition] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  // Stats editing
  const [editingStats, setEditingStats] = useState<string | null>(null);
  const [statsForm, setStatsForm] = useState<Partial<PlayerStats>>({});

  // My permissions (for club admin)
  const [myPermissions, setMyPermissions] = useState<AdminPermission | null>(null);

  // Check access
  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin");
      return;
    }
    if (!loading && user && !isMainAdmin) {
      // Check if approved club admin
      supabase.from("club_admins").select("status").eq("user_id", user.id).single().then(({ data }) => {
        if (!data || data.status !== "approved") {
          signOut();
          navigate("/admin");
        }
      });
      // Load my permissions
      supabase.from("club_admins").select("id").eq("user_id", user.id).single().then(({ data }) => {
        if (data) {
          supabase.from("admin_permissions").select("*").eq("admin_id", data.id).single().then(({ data: perm }) => {
            setMyPermissions(perm as AdminPermission | null);
          });
        }
      });
    }
  }, [user, loading, isMainAdmin, navigate, signOut]);

  // Load data
  useEffect(() => {
    if (!user) return;
    loadPlayers();
    if (isMainAdmin) {
      loadClubAdmins();
    }
  }, [user, isMainAdmin]);

  const loadClubAdmins = async () => {
    const { data } = await supabase.from("club_admins").select("*").order("created_at", { ascending: false });
    setClubAdmins((data as ClubAdmin[]) || []);
    const { data: perms } = await supabase.from("admin_permissions").select("*");
    setPermissions((perms as AdminPermission[]) || []);
  };

  const loadPlayers = async () => {
    const { data } = await supabase.from("players").select("*").order("name");
    setPlayers((data as Player[]) || []);
  };

  const approveAdmin = async (id: string) => {
    await supabase.from("club_admins").update({ status: "approved" }).eq("id", id);
    toast({ title: "Approved!" });
    loadClubAdmins();
  };

  const rejectAdmin = async (id: string) => {
    await supabase.from("club_admins").update({ status: "rejected" }).eq("id", id);
    toast({ title: "Rejected" });
    loadClubAdmins();
  };

  const deleteAdmin = async (id: string) => {
    await supabase.from("club_admins").delete().eq("id", id);
    toast({ title: "Deleted" });
    loadClubAdmins();
  };

  const togglePermission = async (adminId: string, field: string, value: boolean) => {
    await supabase.from("admin_permissions").update({ [field]: value }).eq("admin_id", adminId);
    loadClubAdmins();
  };

  // Player CRUD
  const addPlayer = async () => {
    if (!playerName || !playerAge) return;
    const { error } = await supabase.from("players").insert({
      name: playerName,
      age: parseInt(playerAge),
      team: playerTeam as "main_team" | "academy_team" | "youth_team",
      position: playerPosition || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // Create stats entry
    const { data: newPlayer } = await supabase.from("players").select("id").eq("name", playerName).order("created_at", { ascending: false }).limit(1).single();
    if (newPlayer) {
      await supabase.from("player_stats").insert({ player_id: newPlayer.id });
    }
    toast({ title: "Player Added!" });
    setPlayerName(""); setPlayerAge(""); setPlayerPosition("");
    loadPlayers();
  };

  const updatePlayer = async (id: string) => {
    await supabase.from("players").update({
      name: playerName,
      age: parseInt(playerAge),
      team: playerTeam as "main_team" | "academy_team" | "youth_team",
      position: playerPosition || null,
    }).eq("id", id);
    toast({ title: "Player Updated!" });
    setEditingPlayer(null);
    setPlayerName(""); setPlayerAge(""); setPlayerPosition("");
    loadPlayers();
  };

  const deletePlayer = async (id: string) => {
    await supabase.from("player_stats").delete().eq("player_id", id);
    await supabase.from("players").delete().eq("id", id);
    toast({ title: "Player Deleted" });
    loadPlayers();
  };

  const startEditPlayer = (p: Player) => {
    setEditingPlayer(p.id);
    setPlayerName(p.name);
    setPlayerAge(p.age.toString());
    setPlayerTeam(p.team);
    setPlayerPosition(p.position || "");
  };

  const startEditStats = async (playerId: string) => {
    setEditingStats(playerId);
    const { data } = await supabase.from("player_stats").select("*").eq("player_id", playerId).single();
    if (data) setStatsForm(data as PlayerStats);
  };

  const saveStats = async () => {
    if (!editingStats) return;
    const { id, player_id, ...updates } = statsForm as PlayerStats;
    await supabase.from("player_stats").update(updates).eq("player_id", editingStats);
    toast({ title: "Stats Updated!" });
    setEditingStats(null);
    setStatsForm({});
  };

  const hasPermission = (perm: string) => {
    if (isMainAdmin) return true;
    if (!myPermissions) return false;
    return (myPermissions as any)[perm] === true;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3, show: true },
    { id: "admins", label: "Manage Admins", icon: Users, show: isMainAdmin },
    { id: "players", label: "Players", icon: UserPlus, show: hasPermission("player_control") },
    { id: "stats", label: "Player Stats", icon: BarChart3, show: hasPermission("player_control") },
    { id: "tournaments", label: "Tournaments", icon: Trophy, show: hasPermission("tournament_control") },
    { id: "news", label: "News", icon: Newspaper, show: isMainAdmin },
    { id: "rules", label: "Rules", icon: BookOpen, show: isMainAdmin },
    { id: "clubinfo", label: "Club Info", icon: Info, show: isMainAdmin },
    { id: "logos", label: "Logos", icon: Image, show: isMainAdmin },
  ];

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">ADMIN DASHBOARD</h1>
                <p className="text-sm text-muted-foreground">
                  {isMainAdmin ? "Main Admin" : "Club Admin"} — {user?.email}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => { signOut(); navigate("/admin"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.filter(t => t.show).map(t => (
              <Button key={t.id} variant={activeTab === t.id ? "default" : "outline"} size="sm" onClick={() => setActiveTab(t.id)}>
                <t.icon className="w-4 h-4 mr-1" /> {t.label}
              </Button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-primary">{players.length}</p>
                <p className="text-sm text-muted-foreground">Players</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-primary">{clubAdmins.length}</p>
                <p className="text-sm text-muted-foreground">Club Admins</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-primary">{clubAdmins.filter(a => a.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-primary">{clubAdmins.filter(a => a.status === "approved").length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          )}

          {/* Manage Admins */}
          {activeTab === "admins" && isMainAdmin && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">MANAGE CLUB ADMINS</h2>
              {clubAdmins.length === 0 ? (
                <p className="text-muted-foreground">No club admins yet.</p>
              ) : (
                <div className="space-y-4">
                  {clubAdmins.map(admin => {
                    const perm = permissions.find(p => p.admin_id === admin.id);
                    return (
                      <div key={admin.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-heading font-bold text-foreground">{admin.name || admin.email}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${admin.status === "approved" ? "bg-green-900/30 text-green-400" : admin.status === "rejected" ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                              {admin.status.toUpperCase()}
                            </span>
                            {admin.status === "pending" && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => approveAdmin(admin.id)}>
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => rejectAdmin(admin.id)}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteAdmin(admin.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {admin.status === "approved" && perm && (
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-border">
                            {["player_control", "tournament_control", "result_submit", "draw_system", "download_system"].map(field => (
                              <label key={field} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Checkbox
                                  checked={(perm as any)[field]}
                                  onCheckedChange={(v) => togglePermission(admin.id, field, !!v)}
                                />
                                {field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Players */}
          {activeTab === "players" && hasPermission("player_control") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">PLAYER MANAGEMENT</h2>
              {/* Add/Edit Form */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  {editingPlayer ? "EDIT PLAYER" : "ADD NEW PLAYER"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input placeholder="Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                  <Input placeholder="Age" type="number" value={playerAge} onChange={e => setPlayerAge(e.target.value)} />
                  <select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="main_team">Main Team</option>
                    <option value="academy_team">Academy Team</option>
                    <option value="youth_team">Youth Team</option>
                  </select>
                  <Input placeholder="Position" value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} />
                </div>
                <div className="mt-3 flex gap-2">
                  {editingPlayer ? (
                    <>
                      <Button size="sm" onClick={() => updatePlayer(editingPlayer)}>Update</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingPlayer(null); setPlayerName(""); setPlayerAge(""); setPlayerPosition(""); }}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={addPlayer}>Add Player</Button>
                  )}
                </div>
              </div>
              {/* Player List */}
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Age: {p.age} | {p.team.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} | {p.position || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditPlayer(p)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePlayer(p.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {activeTab === "stats" && hasPermission("player_control") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">PLAYER STATS</h2>
              {editingStats && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <h3 className="font-heading text-sm font-bold text-foreground">EDIT STATS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["matches", "wins", "draws", "losses", "motm", "goals_for", "goals_against", "yellow_cards", "red_cards"].map(field => (
                      <div key={field}>
                        <label className="text-xs text-muted-foreground">{field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
                        <Input type="number" value={(statsForm as any)[field] || 0} onChange={e => setStatsForm(prev => ({ ...prev, [field]: parseInt(e.target.value) || 0 }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveStats}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingStats(null); setStatsForm({}); }}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.team.replace(/_/g, " ")}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => startEditStats(p.id)}>
                      <Settings className="w-3 h-3 mr-1" /> Edit Stats
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tournaments placeholder */}
          {activeTab === "tournaments" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">TOURNAMENT CONTROL</h2>
              <p className="text-muted-foreground text-sm">Tournament management system coming soon.</p>
            </div>
          )}

          {/* News placeholder */}
          {activeTab === "news" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Newspaper className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">NEWS MANAGEMENT</h2>
              <p className="text-muted-foreground text-sm">News management system coming soon.</p>
            </div>
          )}

          {/* Rules placeholder */}
          {activeTab === "rules" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">RULES MANAGEMENT</h2>
              <p className="text-muted-foreground text-sm">Rules management system coming soon.</p>
            </div>
          )}

          {/* Club Info placeholder */}
          {activeTab === "clubinfo" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Info className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">CLUB INFO CONTROL</h2>
              <p className="text-muted-foreground text-sm">Club info management coming soon.</p>
            </div>
          )}

          {/* Logos placeholder */}
          {activeTab === "logos" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Image className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">LOGO MANAGEMENT</h2>
              <p className="text-muted-foreground text-sm">Logo management coming soon.</p>
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default AdminDashboard;
