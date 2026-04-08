import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LOGO_KEYS = {
  club: "logo_club",
  main_team: "logo_main_team",
  academy_team: "logo_academy_team",
  youth_team: "logo_youth_team",
  league: "logo_league",
  champions_league: "logo_champions_league",
  trophy: "logo_trophy",
} as const;

export const useLogos = () => {
  return useQuery({
    queryKey: ["logos"],
    queryFn: async () => {
      const keys = Object.values(LOGO_KEYS);
      const { data } = await supabase
        .from("club_info")
        .select("key, value")
        .in("key", keys);
      const map: Record<string, string> = {};
      data?.forEach((r: any) => {
        if (r.value) map[r.key] = r.value;
      });
      return map;
    },
    staleTime: 30000,
  });
};
