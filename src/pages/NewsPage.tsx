import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Newspaper, Pin } from "lucide-react";

const NewsPage = () => {
  const [lang, setLang] = useState<"en" | "bn">("en");

  const { data: news = [] } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").order("pinned", { ascending: false }).order("published_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">NEWS</h1>
              <p className="text-muted-foreground text-sm">Latest updates from THE TIGER SQUAD</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLang("en")} className={`px-3 py-1 text-xs font-heading rounded ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>EN</button>
              <button onClick={() => setLang("bn")} className={`px-3 py-1 text-xs font-heading rounded ${lang === "bn" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>BN</button>
            </div>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No DATA AVAILABLE</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((n: any) => (
                <div key={n.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="flex items-start gap-3">
                    {n.pinned && <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {lang === "bn" && n.title_bn ? n.title_bn : n.title}
                      </h3>
                      {(lang === "bn" ? n.description_bn : n.description) && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {lang === "bn" ? n.description_bn : n.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(n.published_at).toLocaleDateString()}
                      </p>
                    </div>
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

export default NewsPage;
