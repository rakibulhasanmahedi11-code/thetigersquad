import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { ExternalLink } from "lucide-react";

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

  const makeUrl = (link: string) => link.startsWith("http") ? link : `https://${link}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20" />

      {/* Info Section */}
      <section className="py-16 bg-dark-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
            INFO
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              {/* Page Link */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Page Link</span>
                {pageLink ? (
                  <a href={makeUrl(pageLink)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Join Page
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">No Link Available</span>
                )}
              </div>
              {/* Group Link */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Group Link</span>
                {groupLink ? (
                  <a href={makeUrl(groupLink)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Join Group
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                )}
              </div>
              {/* Support Desk */}
              {supportDesk && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Support Desk</span>
                  <a href={makeUrl(supportDesk)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Join Support Desk
                  </a>
                </div>
              )}
              {/* Club Created */}
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
