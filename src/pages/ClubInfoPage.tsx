import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Globe, Users, Calendar, ExternalLink } from "lucide-react";

const ClubInfoPage = () => {
  const { data: clubInfo = {} } = useQuery({
    queryKey: ["club-info"],
    queryFn: async () => {
      const { data } = await supabase.from("club_info").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value || ""; });
      return map;
    },
  });

  const makeUrl = (link: string) => link.startsWith("http") ? link : `https://${link}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">CLUB INFO</h1>
          <p className="text-muted-foreground text-sm mb-10">Everything about THE TIGER SQUAD</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              {/* Page Link */}
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Page Link</p>
                  {clubInfo.page_link ? (
                    <a href={makeUrl(clubInfo.page_link)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-1 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Join Page
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Link Available</span>
                  )}
                </div>
              </div>
              {/* Group Link */}
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Group Link</p>
                  {clubInfo.group_link ? (
                    <a href={makeUrl(clubInfo.group_link)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-1 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Join Group
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Coming Soon</span>
                  )}
                </div>
              </div>
              {/* Support Desk */}
              {clubInfo.support_desk && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Support Desk</p>
                    <a href={makeUrl(clubInfo.support_desk)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-1 text-sm font-heading font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Join Support Desk
                    </a>
                  </div>
                </div>
              )}
              {/* Club Created */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Club Created</p>
                  <p className="text-sm font-bold text-foreground">{clubInfo.club_created || "2024"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
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
      </div>
      <FooterSection />
    </div>
  );
};

export default ClubInfoPage;
