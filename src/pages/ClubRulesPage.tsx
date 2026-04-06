import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { BookOpen, Pin } from "lucide-react";

const ClubRulesPage = () => {
  const [lang, setLang] = useState<"en" | "bn">("en");

  const { data: rules = [] } = useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data } = await supabase.from("rules").select("*").order("pinned", { ascending: false }).order("sort_order");
      return data || [];
    },
  });

  const categories = [...new Set(rules.map((r: any) => r.category))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">CLUB RULES</h1>
              <p className="text-muted-foreground text-sm">Official rules & regulations</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLang("en")} className={`px-3 py-1 text-xs font-heading rounded ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>EN</button>
              <button onClick={() => setLang("bn")} className={`px-3 py-1 text-xs font-heading rounded ${lang === "bn" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>BN</button>
            </div>
          </div>

          {rules.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No DATA AVAILABLE</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <h2 className="font-heading text-lg font-bold text-primary mb-4 uppercase">{cat}</h2>
                  <div className="space-y-3">
                    {rules.filter((r: any) => r.category === cat).map((r: any) => (
                      <div key={r.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary transition-colors">
                        <div className="flex items-start gap-3">
                          {r.pinned && <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
                          <div>
                            <h3 className="font-heading font-bold text-foreground">
                              {lang === "bn" && r.title_bn ? r.title_bn : r.title}
                            </h3>
                            {(lang === "bn" ? r.content_bn : r.content) && (
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                                {lang === "bn" ? r.content_bn : r.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ClubRulesPage;
