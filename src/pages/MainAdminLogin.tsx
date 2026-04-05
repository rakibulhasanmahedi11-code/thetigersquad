import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAIN_ADMIN_EMAIL = "rakibulhasanmahedi11@gmail.com";

const MainAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== MAIN_ADMIN_EMAIL) {
      toast({ title: "Access Denied", description: "This login is only for the Main Admin.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      // If user doesn't exist yet, sign up first
      if (error.message.includes("Invalid login")) {
        const { error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) {
          toast({ title: "Error", description: signupError.message, variant: "destructive" });
          return;
        }
        // Try login again
        const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
        if (retryError) {
          toast({ title: "Error", description: retryError.message, variant: "destructive" });
          return;
        }
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    toast({ title: "Welcome!", description: "Main Admin logged in successfully." });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">MAIN ADMIN</h2>
              <p className="text-sm text-muted-foreground mt-2">Login with Main Admin credentials</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter admin email" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Logging in..." : "LOGIN"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default MainAdminLogin;
