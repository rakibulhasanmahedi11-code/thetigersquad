import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Globe, Users, Calendar } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">CLUB INFO</h1>
          <p className="text-muted-foreground text-sm mb-10">Everything about THE TIGER SQUAD</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Page Link</p>
                  {clubInfo.page_link ? (
                    <a href={clubInfo.page_link.startsWith("http") ? clubInfo.page_link : `https://${clubInfo.page_link}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {clubInfo.page_link}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Link Available</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Group Link</p>
                  {clubInfo.group_link ? (
                    <a href={clubInfo.group_link.startsWith("http") ? clubInfo.group_link : `https://${clubInfo.group_link}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Join Group
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Link Available</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
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
