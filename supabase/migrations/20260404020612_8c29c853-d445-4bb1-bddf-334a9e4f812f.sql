
-- Create team enum
CREATE TYPE public.player_team AS ENUM ('main_team', 'academy_team', 'youth_team');

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  team player_team NOT NULL DEFAULT 'main_team',
  position TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create player_stats table
CREATE TABLE public.player_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  matches INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  motm INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  yellow_cards INTEGER NOT NULL DEFAULT 0,
  red_cards INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id)
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can view player stats" ON public.player_stats FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated users can insert players" ON public.players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update players" ON public.players FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete players" ON public.players FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert stats" ON public.player_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update stats" ON public.player_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete stats" ON public.player_stats FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON public.player_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for player photos
INSERT INTO storage.buckets (id, name, public) VALUES ('player-photos', 'player-photos', true);

CREATE POLICY "Anyone can view player photos" ON storage.objects FOR SELECT USING (bucket_id = 'player-photos');
CREATE POLICY "Authenticated users can upload player photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'player-photos');
CREATE POLICY "Authenticated users can update player photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'player-photos');
CREATE POLICY "Authenticated users can delete player photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'player-photos');
