import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAIN_ADMIN_EMAIL = "rakibulhasanmahedi11@gmail.com";

const ClubAdminLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MAIN_ADMIN_EMAIL) {
      toast({ title: "Error", description: "Use Main Admin login instead.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    // Check if approved
    const { data: admin } = await supabase.from("club_admins").select("status").eq("user_id", data.user.id).single();
    if (!admin || admin.status !== "approved") {
      await supabase.auth.signOut();
      toast({ title: "Access Pending", description: "Your account is pending approval from the Main Admin.", variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Welcome!", description: "Club Admin logged in." });
    navigate("/admin/dashboard");
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MAIN_ADMIN_EMAIL) {
      toast({ title: "Error", description: "This email is reserved for Main Admin.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    if (data.user) {
      const { error: insertError } = await supabase.from("club_admins").insert({
        user_id: data.user.id,
        email,
        name,
        status: "pending",
      });
      if (insertError) {
        toast({ title: "Error", description: insertError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    }
    await supabase.auth.signOut();
    toast({ title: "Signup Successful!", description: "Your account is pending approval. Please wait for Main Admin to approve." });
    setIsSignup(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">CLUB ADMIN</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {isSignup ? "Create a new Club Admin account" : "Login to Club Admin panel"}
              </p>
            </div>
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {isSignup ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                {loading ? "Please wait..." : isSignup ? "SIGN UP" : "LOGIN"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-primary hover:underline">
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ClubAdminLogin;
