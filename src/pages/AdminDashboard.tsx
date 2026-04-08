import { useEffect, useState, useRef } from "react";
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
  Settings, Trophy, BarChart3, Newspaper, BookOpen, Info, Image,
  Edit, Plus, Pin, Calendar, Upload, Shuffle
} from "lucide-react";

// Helper: calculate age from DOB
const calcAge = (dob: string | null): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

interface ClubAdmin {
  id: string; user_id: string; email: string; name: string; status: string;
}
interface AdminPermission {
  id: string; admin_id: string; player_control: boolean; tournament_control: boolean;
  result_submit: boolean; draw_system: boolean; download_system: boolean;
}
interface Player {
  id: string; name: string; age: number; team: string; position: string | null;
  photo_url: string | null; date_of_birth: string | null;
}
interface PlayerStats {
  id: string; player_id: string; matches: number; wins: number; draws: number;
  losses: number; motm: number; goals_for: number; goals_against: number;
  yellow_cards: number; red_cards: number;
}
interface Tournament {
  id: string; name: string; type: string; season: string; year: number; status: string;
}
interface NewsItem {
  id: string; title: string; title_bn: string | null; description: string | null;
  description_bn: string | null; image_url: string | null; pinned: boolean;
  published_at: string;
}
interface RuleItem {
  id: string; title: string; title_bn: string | null; content: string | null;
  content_bn: string | null; category: string; pinned: boolean; sort_order: number;
}

// Logo Management Component
const logoConfigs = [
  { label: "Club Logo", key: "logo_club" },
  { label: "Main Team Logo", key: "logo_main_team" },
  { label: "Academy Team Logo", key: "logo_academy_team" },
  { label: "Youth Team Logo", key: "logo_youth_team" },
  { label: "TTS League Logo", key: "logo_league" },
  { label: "TTS Champions League Logo", key: "logo_champions_league" },
  { label: "TTS Trophy Logo", key: "logo_trophy" },
];

const LogoManagement = ({ toast }: { toast: any }) => {
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    const keys = logoConfigs.map(c => c.key);
    const { data } = await supabase.from("club_info").select("key, value").in("key", keys);
    const map: Record<string, string> = {};
    data?.forEach((r: any) => { if (r.value) map[r.key] = r.value; });
    setLogos(map);
  };

  const handleLogoUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File size must be under 2MB", variant: "destructive" }); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast({ title: "Only JPG/PNG/WEBP allowed", variant: "destructive" }); return; }

    setUploading(key);
    const ext = file.name.split(".").pop();
    const path = `${key}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(null); return; }
    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
    const url = urlData.publicUrl + "?t=" + Date.now();

    // Save URL to club_info
    const { data: existing } = await supabase.from("club_info").select("id").eq("key", key).single();
    if (existing) {
      await supabase.from("club_info").update({ value: url }).eq("key", key);
    } else {
      await supabase.from("club_info").insert({ key, value: url });
    }

    setLogos(prev => ({ ...prev, [key]: url }));
    setUploading(null);
    toast({ title: "Logo uploaded!" });
  };

  const removeLogo = async (key: string) => {
    await supabase.from("club_info").update({ value: null }).eq("key", key);
    setLogos(prev => { const u = { ...prev }; delete u[key]; return u; });
    if (inputRefs.current[key]) inputRefs.current[key]!.value = "";
    toast({ title: "Logo removed" });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">LOGO MANAGEMENT</h2>
      <p className="text-sm text-muted-foreground">Upload logos here. They will auto-update across the entire website.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logoConfigs.map(({ label, key }) => (
          <div
            key={key}
            className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => !uploading && inputRefs.current[key]?.click()}
          >
            <input
              ref={el => { inputRefs.current[key] = el; }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => handleLogoUpload(key, e)}
            />
            {uploading === key ? (
              <div className="w-20 h-20 mx-auto flex items-center justify-center mb-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logos[key] ? (
              <div className="relative inline-block">
                <img src={logos[key]} alt={label} className="w-20 h-20 mx-auto object-contain rounded-lg mb-2" />
                <button
                  onClick={e => { e.stopPropagation(); removeLogo(key); }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >×</button>
              </div>
            ) : (
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            )}
            <p className="font-heading text-sm font-bold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{logos[key] ? "Click to replace" : "Click to upload"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, loading, isMainAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const photoInputRef = useRef<HTMLInputElement>(null);

  // States
  const [clubAdmins, setClubAdmins] = useState<ClubAdmin[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [rulesList, setRulesList] = useState<RuleItem[]>([]);
  const [clubInfo, setClubInfo] = useState<Record<string, string>>({});

  // Player form
  const [playerName, setPlayerName] = useState("");
  const [playerDob, setPlayerDob] = useState("");
  const [playerTeam, setPlayerTeam] = useState("main_team");
  const [playerPhotoFile, setPlayerPhotoFile] = useState<File | null>(null);
  const [playerPhotoPreview, setPlayerPhotoPreview] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  // Stats
  const [editingStats, setEditingStats] = useState<string | null>(null);
  const [statsForm, setStatsForm] = useState<Partial<PlayerStats>>({});

  // Tournament form
  const [tName, setTName] = useState("");
  const [tType, setTType] = useState("league");
  const [tSeason, setTSeason] = useState("S1");
  const [tYear, setTYear] = useState(new Date().getFullYear());
  const [editingTournament, setEditingTournament] = useState<string | null>(null);

  // News form
  const [newsTitle, setNewsTitle] = useState("");
  const [newsTitleBn, setNewsTitleBn] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsDescBn, setNewsDescBn] = useState("");
  const [newsPinned, setNewsPinned] = useState(false);
  const [editingNews, setEditingNews] = useState<string | null>(null);

  // Rules form
  const [ruleTitle, setRuleTitle] = useState("");
  const [ruleTitleBn, setRuleTitleBn] = useState("");
  const [ruleContent, setRuleContent] = useState("");
  const [ruleContentBn, setRuleContentBn] = useState("");
  const [ruleCategory, setRuleCategory] = useState("general");
  const [rulePinned, setRulePinned] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  // Club info form
  const [ciPageLink, setCiPageLink] = useState("");
  const [ciGroupLink, setCiGroupLink] = useState("");
  const [ciClubCreated, setCiClubCreated] = useState("");
  const [ciSupportDesk, setCiSupportDesk] = useState("");

  // My permissions (club admin)
  const [myPermissions, setMyPermissions] = useState<AdminPermission | null>(null);

  useEffect(() => {
    if (!loading && !user) { navigate("/admin"); return; }
    if (!loading && user && !isMainAdmin) {
      supabase.from("club_admins").select("status").eq("user_id", user.id).single().then(({ data }) => {
        if (!data || data.status !== "approved") { signOut(); navigate("/admin"); }
      });
      supabase.from("club_admins").select("id").eq("user_id", user.id).single().then(({ data }) => {
        if (data) {
          supabase.from("admin_permissions").select("*").eq("admin_id", data.id).single().then(({ data: perm }) => {
            setMyPermissions(perm as AdminPermission | null);
          });
        }
      });
    }
  }, [user, loading, isMainAdmin, navigate, signOut]);

  useEffect(() => {
    if (!user) return;
    loadPlayers(); loadTournaments(); loadNews(); loadRules(); loadClubInfo();
    if (isMainAdmin) loadClubAdmins();
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
  const loadTournaments = async () => {
    const { data } = await supabase.from("tournaments").select("*").order("created_at", { ascending: false });
    setTournaments((data as Tournament[]) || []);
  };
  const loadNews = async () => {
    const { data } = await supabase.from("news").select("*").order("pinned", { ascending: false }).order("published_at", { ascending: false });
    setNewsList((data as NewsItem[]) || []);
  };
  const loadRules = async () => {
    const { data } = await supabase.from("rules").select("*").order("pinned", { ascending: false }).order("sort_order");
    setRulesList((data as RuleItem[]) || []);
  };
  const loadClubInfo = async () => {
    const { data } = await supabase.from("club_info").select("*");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((r: any) => { map[r.key] = r.value || ""; });
      setClubInfo(map);
      setCiPageLink(map.page_link || "");
      setCiGroupLink(map.group_link || "");
      setCiClubCreated(map.club_created || "");
      setCiSupportDesk(map.support_desk || "");
    }
  };

  // Admin actions
  const approveAdmin = async (id: string) => { await supabase.from("club_admins").update({ status: "approved" }).eq("id", id); toast({ title: "Approved!" }); loadClubAdmins(); };
  const rejectAdmin = async (id: string) => { await supabase.from("club_admins").update({ status: "rejected" }).eq("id", id); toast({ title: "Rejected" }); loadClubAdmins(); };
  const deleteAdmin = async (id: string) => { await supabase.from("club_admins").delete().eq("id", id); toast({ title: "Deleted" }); loadClubAdmins(); };
  const togglePermission = async (adminId: string, field: string, value: boolean) => {
    await supabase.from("admin_permissions").update({ [field]: value } as any).eq("admin_id", adminId);
    loadClubAdmins();
  };

  // Photo handling
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File size must be under 2MB", variant: "destructive" }); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      toast({ title: "Only JPG/PNG/WEBP allowed", variant: "destructive" }); return;
    }
    setPlayerPhotoFile(file);
    setPlayerPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (playerId: string): Promise<string | null> => {
    if (!playerPhotoFile) return null;
    const ext = playerPhotoFile.name.split(".").pop();
    const path = `${playerId}.${ext}`;
    const { error } = await supabase.storage.from("player-photos").upload(path, playerPhotoFile, { upsert: true });
    if (error) { console.error(error); return null; }
    const { data } = supabase.storage.from("player-photos").getPublicUrl(path);
    return data.publicUrl + "?t=" + Date.now();
  };

  // Player CRUD
  const resetPlayerForm = () => {
    setPlayerName(""); setPlayerDob(""); setPlayerTeam("main_team");
    setPlayerPhotoFile(null); setPlayerPhotoPreview(null); setEditingPlayer(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const addPlayer = async () => {
    if (!playerName || !playerDob) { toast({ title: "Name & DOB required", variant: "destructive" }); return; }
    const age = calcAge(playerDob);
    const { data: newPlayer, error } = await supabase.from("players").insert({
      name: playerName, age, date_of_birth: playerDob,
      team: playerTeam as any, position: null,
    }).select("id").single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (newPlayer) {
      const photoUrl = await uploadPhoto(newPlayer.id);
      if (photoUrl) await supabase.from("players").update({ photo_url: photoUrl }).eq("id", newPlayer.id);
      await supabase.from("player_stats").insert({ player_id: newPlayer.id });
    }
    toast({ title: "Player Added!" });
    resetPlayerForm(); loadPlayers();
  };

  const updatePlayer = async (id: string) => {
    const age = calcAge(playerDob);
    const photoUrl = await uploadPhoto(id);
    const updates: any = { name: playerName, age, date_of_birth: playerDob, team: playerTeam as any };
    if (photoUrl) updates.photo_url = photoUrl;
    await supabase.from("players").update(updates).eq("id", id);
    toast({ title: "Player Updated!" });
    resetPlayerForm(); loadPlayers();
  };

  const deletePlayer = async (id: string) => {
    await supabase.from("player_stats").delete().eq("player_id", id);
    await supabase.from("players").delete().eq("id", id);
    toast({ title: "Player Deleted" }); loadPlayers();
  };

  const startEditPlayer = (p: Player) => {
    setEditingPlayer(p.id); setPlayerName(p.name);
    setPlayerDob(p.date_of_birth || ""); setPlayerTeam(p.team);
    setPlayerPhotoPreview(p.photo_url);
  };

  // Stats
  const startEditStats = async (playerId: string) => {
    setEditingStats(playerId);
    const { data } = await supabase.from("player_stats").select("*").eq("player_id", playerId).single();
    if (data) setStatsForm(data as PlayerStats);
  };
  const saveStats = async () => {
    if (!editingStats) return;
    const f = statsForm as any;
    if ((f.wins || 0) + (f.draws || 0) + (f.losses || 0) > (f.matches || 0)) {
      toast({ title: "W+D+L cannot exceed Matches", variant: "destructive" }); return;
    }
    const { id, player_id, created_at, updated_at, ...updates } = f;
    await supabase.from("player_stats").update(updates).eq("player_id", editingStats);
    toast({ title: "Stats Updated!" }); setEditingStats(null); setStatsForm({});
  };

  // Tournament CRUD
  const typeLabels: Record<string, string> = { league: "TTS League", champions_league: "TTS Champions League", trophy: "TTS Trophy" };
  const getAutoName = (type: string, season: string, year: number) => `${typeLabels[type] || type} - ${season} (${year})`;
  const resetTournamentForm = () => { setTName(""); setTType("league"); setTSeason("S1"); setTYear(new Date().getFullYear()); setEditingTournament(null); };
  const addTournament = async () => {
    const autoName = getAutoName(tType, tSeason, tYear);
    const { error } = await supabase.from("tournaments").insert({ name: autoName, type: tType, season: tSeason, year: tYear });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Tournament Created!" }); resetTournamentForm(); loadTournaments();
  };
  const updateTournament = async (id: string) => {
    const autoName = editingTournament ? getAutoName(tType, tSeason, tYear) : tName;
    await supabase.from("tournaments").update({ name: autoName, type: tType, season: tSeason, year: tYear }).eq("id", id);
    toast({ title: "Tournament Updated!" }); resetTournamentForm(); loadTournaments();
  };
  const deleteTournament = async (id: string) => {
    await supabase.from("tournaments").delete().eq("id", id);
    toast({ title: "Deleted" }); loadTournaments();
  };

  // News CRUD
  const resetNewsForm = () => { setNewsTitle(""); setNewsTitleBn(""); setNewsDesc(""); setNewsDescBn(""); setNewsPinned(false); setEditingNews(null); };
  const addNews = async () => {
    if (!newsTitle) return;
    await supabase.from("news").insert({ title: newsTitle, title_bn: newsTitleBn || null, description: newsDesc || null, description_bn: newsDescBn || null, pinned: newsPinned });
    toast({ title: "News Added!" }); resetNewsForm(); loadNews();
  };
  const updateNews = async (id: string) => {
    await supabase.from("news").update({ title: newsTitle, title_bn: newsTitleBn || null, description: newsDesc || null, description_bn: newsDescBn || null, pinned: newsPinned }).eq("id", id);
    toast({ title: "News Updated!" }); resetNewsForm(); loadNews();
  };
  const deleteNews = async (id: string) => { await supabase.from("news").delete().eq("id", id); toast({ title: "Deleted" }); loadNews(); };

  // Rules CRUD
  const resetRuleForm = () => { setRuleTitle(""); setRuleTitleBn(""); setRuleContent(""); setRuleContentBn(""); setRuleCategory("general"); setRulePinned(false); setEditingRule(null); };
  const addRule = async () => {
    if (!ruleTitle) return;
    await supabase.from("rules").insert({ title: ruleTitle, title_bn: ruleTitleBn || null, content: ruleContent || null, content_bn: ruleContentBn || null, category: ruleCategory, pinned: rulePinned });
    toast({ title: "Rule Added!" }); resetRuleForm(); loadRules();
  };
  const updateRule = async (id: string) => {
    await supabase.from("rules").update({ title: ruleTitle, title_bn: ruleTitleBn || null, content: ruleContent || null, content_bn: ruleContentBn || null, category: ruleCategory, pinned: rulePinned }).eq("id", id);
    toast({ title: "Rule Updated!" }); resetRuleForm(); loadRules();
  };
  const deleteRule = async (id: string) => { await supabase.from("rules").delete().eq("id", id); toast({ title: "Deleted" }); loadRules(); };

  // Club info save
  const saveClubInfo = async () => {
    const entries = [
      { key: "page_link", value: ciPageLink },
      { key: "group_link", value: ciGroupLink },
      { key: "club_created", value: ciClubCreated },
      { key: "support_desk", value: ciSupportDesk },
    ];
    for (const e of entries) {
      const { data } = await supabase.from("club_info").select("id").eq("key", e.key).single();
      if (data) {
        await supabase.from("club_info").update({ value: e.value }).eq("key", e.key);
      } else {
        await supabase.from("club_info").insert(e);
      }
    }
    toast({ title: "Club Info Saved!" }); loadClubInfo();
  };

  const hasPermission = (perm: string) => {
    if (isMainAdmin) return true;
    if (!myPermissions) return false;
    return (myPermissions as any)[perm] === true;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3, show: true },
    { id: "admins", label: "Admins", icon: Users, show: isMainAdmin },
    { id: "players", label: "Players", icon: UserPlus, show: hasPermission("player_control") },
    { id: "stats", label: "Stats", icon: BarChart3, show: hasPermission("player_control") },
    { id: "tournaments", label: "Tournaments", icon: Trophy, show: hasPermission("tournament_control") },
    { id: "scoreboard", label: "Scoreboard", icon: Trophy, show: hasPermission("tournament_control") },
    { id: "draw", label: "Draw", icon: Shuffle, show: hasPermission("draw_system") },
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
                <p className="text-sm text-muted-foreground">{isMainAdmin ? "Main Admin" : "Club Admin"} — {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => { signOut(); navigate("/admin"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
            {tabs.filter(t => t.show).map(t => (
              <Button key={t.id} variant={activeTab === t.id ? "default" : "outline"} size="sm" onClick={() => setActiveTab(t.id)}>
                <t.icon className="w-4 h-4 mr-1" /> {t.label}
              </Button>
            ))}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Players", value: players.length },
                { label: "Club Admins", value: clubAdmins.length },
                { label: "Tournaments", value: tournaments.length },
                { label: "Pending Admins", value: clubAdmins.filter(a => a.status === "pending").length },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ===== MANAGE ADMINS ===== */}
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
                                <Button size="sm" variant="outline" onClick={() => approveAdmin(admin.id)}><Check className="w-3 h-3" /></Button>
                                <Button size="sm" variant="outline" onClick={() => rejectAdmin(admin.id)}><X className="w-3 h-3" /></Button>
                              </>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteAdmin(admin.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                        {admin.status === "approved" && perm && (
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-border">
                            {["player_control", "tournament_control", "result_submit", "draw_system", "download_system"].map(field => (
                              <label key={field} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Checkbox checked={(perm as any)[field]} onCheckedChange={(v) => togglePermission(admin.id, field, !!v)} />
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

          {/* ===== PLAYERS ===== */}
          {activeTab === "players" && hasPermission("player_control") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">PLAYER MANAGEMENT</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  {editingPlayer ? "EDIT PLAYER" : "ADD NEW PLAYER"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                    <Input type="date" value={playerDob} onChange={e => setPlayerDob(e.target.value)} />
                    {playerDob && <p className="text-xs text-primary mt-1">Age: {calcAge(playerDob)}</p>}
                  </div>
                  <select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="main_team">Main Team</option>
                    <option value="academy_team">Academy Team</option>
                    <option value="youth_team">Youth Team</option>
                  </select>
                </div>
                {/* Photo upload */}
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Player Photo (JPG/PNG/WEBP, max 2MB)</label>
                  <div className="flex items-center gap-4">
                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoSelect} className="text-sm text-foreground" />
                    {playerPhotoPreview && (
                      <div className="relative">
                        <img src={playerPhotoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                        <button onClick={() => { setPlayerPhotoFile(null); setPlayerPhotoPreview(null); if (photoInputRef.current) photoInputRef.current.value = ""; }} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {editingPlayer ? (
                    <>
                      <Button size="sm" onClick={() => updatePlayer(editingPlayer)}>Update</Button>
                      <Button size="sm" variant="outline" onClick={resetPlayerForm}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={addPlayer}><Plus className="w-3 h-3 mr-1" /> Add Player</Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {players.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
                ) : players.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                        {p.photo_url ? <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full bg-muted flex items-center justify-center"><UserPlus className="w-4 h-4 text-muted-foreground" /></div>}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Age: {calcAge(p.date_of_birth)} | {p.team.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditPlayer(p)}><Edit className="w-3 h-3" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePlayer(p.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== STATS ===== */}
          {activeTab === "stats" && hasPermission("player_control") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">PLAYER STATS</h2>
              {editingStats && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <h3 className="font-heading text-sm font-bold text-foreground">EDIT STATS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: "matches", label: "Matches" },
                      { key: "wins", label: "Wins" },
                      { key: "draws", label: "Draws" },
                      { key: "losses", label: "Losses" },
                      { key: "motm", label: "MOTM 👑" },
                      { key: "goals_for", label: "Goals For" },
                      { key: "goals_against", label: "Goals Against" },
                      { key: "yellow_cards", label: "Yellow 🟨" },
                      { key: "red_cards", label: "Red 🟥" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-muted-foreground">{f.label}</label>
                        <Input type="number" value={(statsForm as any)[f.key] || 0} onChange={e => setStatsForm(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Rule: Wins + Draws + Losses ≤ Matches</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveStats}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingStats(null); setStatsForm({}); }}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {players.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
                ) : players.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                        {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full bg-muted flex items-center justify-center"><UserPlus className="w-3 h-3 text-muted-foreground" /></div>}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.team.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => startEditStats(p.id)}>
                      <Settings className="w-3 h-3 mr-1" /> Edit Stats
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== TOURNAMENTS ===== */}
          {activeTab === "tournaments" && hasPermission("tournament_control") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">TOURNAMENT MANAGEMENT</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">
                  {editingTournament ? "EDIT TOURNAMENT" : "CREATE TOURNAMENT"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select value={tType} onChange={e => setTType(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="league">TTS League</option>
                    <option value="champions_league">TTS Champions League</option>
                    <option value="trophy">TTS Trophy</option>
                  </select>
                  <select value={tSeason} onChange={e => setTSeason(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    {Array.from({ length: 12 }, (_, i) => `S${i + 1}`).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <Input type="number" placeholder="Year" value={tYear} onChange={e => setTYear(parseInt(e.target.value) || 2026)} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Auto Name: <span className="text-primary font-bold">{getAutoName(tType, tSeason, tYear)}</span></p>
                <div className="mt-3 flex gap-2">
                  {editingTournament ? (
                    <>
                      <Button size="sm" onClick={() => updateTournament(editingTournament)}>Update</Button>
                      <Button size="sm" variant="outline" onClick={resetTournamentForm}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={addTournament}><Plus className="w-3 h-3 mr-1" /> Create</Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {tournaments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
                ) : tournaments.map(t => (
                  <div key={t.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.type.replace(/_/g, " ").toUpperCase()} • {t.season} • {t.year} • <span className="text-primary">{t.status}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingTournament(t.id); setTName(t.name); setTType(t.type); setTSeason(t.season); setTYear(t.year); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTournament(t.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== SCOREBOARD (View Only) ===== */}
          {activeTab === "scoreboard" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">TOURNAMENT SCOREBOARDS</h2>
              {tournaments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
              ) : tournaments.map(t => (
                <div key={t.id} className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-heading font-bold text-foreground mb-2">{t.name} — {t.season} {t.year}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-xs text-muted-foreground border-b border-border">
                        <th className="text-left py-2">Player</th><th className="text-center py-2">M</th><th className="text-center py-2">W</th><th className="text-center py-2">D</th><th className="text-center py-2">L</th><th className="text-center py-2">GD</th><th className="text-center py-2 text-primary">PTS</th>
                      </tr></thead>
                      <tbody>
                        <tr><td colSpan={7} className="text-center py-4 text-muted-foreground text-xs">No DATA AVAILABLE — Data activates after Result system ON</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== DRAW ===== */}
          {activeTab === "draw" && hasPermission("draw_system") && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">LIVE DRAW SYSTEM</h2>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <Shuffle className="w-12 h-12 mx-auto text-primary mb-4" />
                <p className="text-muted-foreground text-sm mb-4">Select a tournament to start draw</p>
                {tournaments.length === 0 ? (
                  <p className="text-muted-foreground text-xs">No tournaments created yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tournaments.map(t => (
                      <Button key={t.id} variant="outline" size="sm">{t.name}</Button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">Draw animation & matchup system — Coming with Fixture system</p>
              </div>
            </div>
          )}

          {/* ===== NEWS ===== */}
          {activeTab === "news" && isMainAdmin && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">NEWS MANAGEMENT</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">{editingNews ? "EDIT NEWS" : "ADD NEWS"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Title (English)" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
                  <Input placeholder="Title (বাংলা)" value={newsTitleBn} onChange={e => setNewsTitleBn(e.target.value)} />
                  <textarea placeholder="Description (English)" value={newsDesc} onChange={e => setNewsDesc(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground min-h-[80px]" />
                  <textarea placeholder="Description (বাংলা)" value={newsDescBn} onChange={e => setNewsDescBn(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground min-h-[80px]" />
                </div>
                <label className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Checkbox checked={newsPinned} onCheckedChange={v => setNewsPinned(!!v)} /> Pin this news
                </label>
                <div className="mt-3 flex gap-2">
                  {editingNews ? (
                    <>
                      <Button size="sm" onClick={() => updateNews(editingNews)}>Update</Button>
                      <Button size="sm" variant="outline" onClick={resetNewsForm}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={addNews}><Plus className="w-3 h-3 mr-1" /> Add News</Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {newsList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
                ) : newsList.map(n => (
                  <div key={n.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {n.pinned && <Pin className="w-3 h-3 text-primary" />}
                        <p className="font-heading font-bold text-foreground text-sm">{n.title}</p>
                      </div>
                      {n.title_bn && <p className="text-xs text-muted-foreground">{n.title_bn}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingNews(n.id); setNewsTitle(n.title); setNewsTitleBn(n.title_bn || ""); setNewsDesc(n.description || ""); setNewsDescBn(n.description_bn || ""); setNewsPinned(n.pinned); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteNews(n.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== RULES ===== */}
          {activeTab === "rules" && isMainAdmin && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">RULES MANAGEMENT</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-bold text-foreground mb-3">{editingRule ? "EDIT RULE" : "ADD RULE"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Title (English)" value={ruleTitle} onChange={e => setRuleTitle(e.target.value)} />
                  <Input placeholder="Title (বাংলা)" value={ruleTitleBn} onChange={e => setRuleTitleBn(e.target.value)} />
                  <textarea placeholder="Content (English)" value={ruleContent} onChange={e => setRuleContent(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground min-h-[80px]" />
                  <textarea placeholder="Content (বাংলা)" value={ruleContentBn} onChange={e => setRuleContentBn(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground min-h-[80px]" />
                </div>
                <div className="flex gap-3 mt-3">
                  <select value={ruleCategory} onChange={e => setRuleCategory(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="general">General</option>
                    <option value="match">Match Rules</option>
                    <option value="discipline">Discipline</option>
                    <option value="tournament">Tournament</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox checked={rulePinned} onCheckedChange={v => setRulePinned(!!v)} /> Pin
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  {editingRule ? (
                    <>
                      <Button size="sm" onClick={() => updateRule(editingRule)}>Update</Button>
                      <Button size="sm" variant="outline" onClick={resetRuleForm}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={addRule}><Plus className="w-3 h-3 mr-1" /> Add Rule</Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {rulesList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No DATA AVAILABLE</div>
                ) : rulesList.map(r => (
                  <div key={r.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {r.pinned && <Pin className="w-3 h-3 text-primary" />}
                        <p className="font-heading font-bold text-foreground text-sm">{r.title}</p>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{r.category}</span>
                      </div>
                      {r.title_bn && <p className="text-xs text-muted-foreground">{r.title_bn}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingRule(r.id); setRuleTitle(r.title); setRuleTitleBn(r.title_bn || ""); setRuleContent(r.content || ""); setRuleContentBn(r.content_bn || ""); setRuleCategory(r.category); setRulePinned(r.pinned); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteRule(r.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CLUB INFO ===== */}
          {activeTab === "clubinfo" && isMainAdmin && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-foreground">CLUB INFO CONTROL</h2>
              <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Page Link</label>
                  <Input value={ciPageLink} onChange={e => setCiPageLink(e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Group Link</label>
                  <Input value={ciGroupLink} onChange={e => setCiGroupLink(e.target.value)} placeholder="https://facebook.com/groups/..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Support Desk Link</label>
                  <Input value={ciSupportDesk} onChange={e => setCiSupportDesk(e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Club Created</label>
                  <Input value={ciClubCreated} onChange={e => setCiClubCreated(e.target.value)} />
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-1">🔒 FIXED — Cannot be changed</p>
                  <p className="text-sm text-foreground">Website Created & Designed by: <span className="text-primary font-bold">MAHEDI HASAN</span></p>
                  <p className="text-sm text-foreground">Role: <span className="font-bold">Admin & Captain</span></p>
                </div>
                <Button size="sm" onClick={saveClubInfo}>Save Club Info</Button>
              </div>
            </div>
          )}

          {/* ===== LOGOS ===== */}
          {activeTab === "logos" && isMainAdmin && (
            <LogoManagement toast={toast} />
          )}

          {/* ===== FIXTURE (Inactive) ===== */}
          {activeTab === "fixture" && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">FIXTURE</h2>
              <p className="text-muted-foreground text-sm">No fixture data available</p>
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default AdminDashboard;
