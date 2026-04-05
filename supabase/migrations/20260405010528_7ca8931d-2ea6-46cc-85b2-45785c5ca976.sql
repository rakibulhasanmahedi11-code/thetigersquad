
-- Helper function to check if user is main admin
CREATE OR REPLACE FUNCTION public.is_main_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'rakibulhasanmahedi11@gmail.com'
  )
$$;

-- Club admins table
CREATE TABLE public.club_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.club_admins ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view club admins
CREATE POLICY "Authenticated users can view club admins"
ON public.club_admins FOR SELECT TO authenticated
USING (true);

-- Users can insert their own club admin entry
CREATE POLICY "Users can create own club admin"
ON public.club_admins FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only main admin can update club admins (approve/reject)
CREATE POLICY "Main admin can update club admins"
ON public.club_admins FOR UPDATE TO authenticated
USING (public.is_main_admin());

-- Only main admin can delete club admins
CREATE POLICY "Main admin can delete club admins"
ON public.club_admins FOR DELETE TO authenticated
USING (public.is_main_admin());

-- Admin permissions table
CREATE TABLE public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.club_admins(id) ON DELETE CASCADE UNIQUE,
  player_control boolean NOT NULL DEFAULT false,
  tournament_control boolean NOT NULL DEFAULT false,
  result_submit boolean NOT NULL DEFAULT false,
  draw_system boolean NOT NULL DEFAULT false,
  download_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view permissions
CREATE POLICY "Authenticated users can view permissions"
ON public.admin_permissions FOR SELECT TO authenticated
USING (true);

-- Only main admin can manage permissions
CREATE POLICY "Main admin can insert permissions"
ON public.admin_permissions FOR INSERT TO authenticated
WITH CHECK (public.is_main_admin());

CREATE POLICY "Main admin can update permissions"
ON public.admin_permissions FOR UPDATE TO authenticated
USING (public.is_main_admin());

CREATE POLICY "Main admin can delete permissions"
ON public.admin_permissions FOR DELETE TO authenticated
USING (public.is_main_admin());

-- Auto-create permissions row when club admin is created
CREATE OR REPLACE FUNCTION public.create_admin_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_permissions (admin_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_club_admin_created
AFTER INSERT ON public.club_admins
FOR EACH ROW
EXECUTE FUNCTION public.create_admin_permissions();

-- Triggers for updated_at
CREATE TRIGGER update_club_admins_updated_at
BEFORE UPDATE ON public.club_admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_permissions_updated_at
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
