
-- Add date_of_birth to players
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Tournaments
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'league',
  season TEXT NOT NULL DEFAULT 'S1',
  year INTEGER NOT NULL DEFAULT 2026,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert tournaments" ON public.tournaments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update tournaments" ON public.tournaments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete tournaments" ON public.tournaments FOR DELETE TO authenticated USING (true);

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  player1_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  score1 INTEGER DEFAULT 0,
  score2 INTEGER DEFAULT 0,
  motm_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  player1_yellow INTEGER DEFAULT 0,
  player1_red INTEGER DEFAULT 0,
  player2_yellow INTEGER DEFAULT 0,
  player2_red INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled',
  match_date TIMESTAMP WITH TIME ZONE,
  round TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update matches" ON public.matches FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete matches" ON public.matches FOR DELETE TO authenticated USING (true);

-- Tournament Standings
CREATE TABLE IF NOT EXISTS public.tournament_standings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  matches INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, player_id)
);
ALTER TABLE public.tournament_standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view standings" ON public.tournament_standings FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert standings" ON public.tournament_standings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update standings" ON public.tournament_standings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete standings" ON public.tournament_standings FOR DELETE TO authenticated USING (true);

-- News
CREATE TABLE IF NOT EXISTS public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  image_url TEXT,
  pinned BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert news" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update news" ON public.news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete news" ON public.news FOR DELETE TO authenticated USING (true);

-- Rules
CREATE TABLE IF NOT EXISTS public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  content TEXT,
  content_bn TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  pinned BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rules" ON public.rules FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert rules" ON public.rules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update rules" ON public.rules FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete rules" ON public.rules FOR DELETE TO authenticated USING (true);

-- Club Info (key-value config)
CREATE TABLE IF NOT EXISTS public.club_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.club_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view club info" ON public.club_info FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert club info" ON public.club_info FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update club info" ON public.club_info FOR UPDATE TO authenticated USING (true);

-- Draw Results
CREATE TABLE IF NOT EXISTS public.draw_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  round TEXT,
  matchups JSONB NOT NULL DEFAULT '[]'::jsonb,
  draw_type TEXT NOT NULL DEFAULT 'auto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view draw results" ON public.draw_results FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert draw results" ON public.draw_results FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can delete draw results" ON public.draw_results FOR DELETE TO authenticated USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_standings_updated_at BEFORE UPDATE ON public.tournament_standings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON public.rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default club info
INSERT INTO public.club_info (key, value) VALUES 
  ('club_name', 'THE TIGER SQUAD'),
  ('page_link', 'thetigersquad.lovable.app'),
  ('group_link', ''),
  ('club_created', '2024')
ON CONFLICT (key) DO NOTHING;
