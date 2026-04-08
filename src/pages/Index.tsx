import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  const { data: clubInfo = {} } = useQuery({
    queryKey: ["club-info-home"],
    queryFn: async () => {
      const { data } = await supabase.from("club_info").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value || ""; });
      return map;
    },
  });

  const pageLink = clubInfo.page_link || "";
  const groupLink = clubInfo.group_link || "";
  const supportDesk = clubInfo.support_desk || "";
  const clubCreated = clubInfo.club_created || "2024";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Info Section */}
      <section className="py-16 bg-dark-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
            INFO
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Page Link</span>
                {pageLink ? (
                  <a href={pageLink.startsWith("http") ? pageLink : `https://${pageLink}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {pageLink}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">No Link Available</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Group Link</span>
                {groupLink ? (
                  <a href={groupLink.startsWith("http") ? groupLink : `https://${groupLink}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Join Group
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">No Link Available</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Support Desk</span>
                {supportDesk ? (
                  <a href={supportDesk.startsWith("http") ? supportDesk : `https://${supportDesk}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Support Desk
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">No Link Available</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Club Created</span>
                <span className="text-sm text-foreground font-bold">{clubCreated}</span>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Website Created & Designed by</p>
                <p className="text-lg font-heading font-bold text-primary">MAHEDI HASAN</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="text-sm font-heading font-bold text-foreground">Admin & Captain</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Index;
