-- =====================================================
-- SUPABASE SECURITY ADVISOR FIXES
-- =====================================================
-- Bu SQL komutlarını Supabase Dashboard > SQL Editor'da çalıştırın
-- 
-- HATALARIN ÖZETİ:
-- 1. RLS (Row Level Security) Disabled in Public - Tüm tablolarda
-- 2. Function Search Path Mutable - 2 fonksiyonda
--
-- =====================================================

-- =====================================================
-- FIX 1: Enable RLS on all tables in public schema
-- =====================================================

-- Users tablosu için RLS etkinleştir
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users RLS Politikaları
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid()::text = id::text);

-- Email Verifications tablosu için RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verifications" 
  ON public.email_verifications FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own verifications" 
  ON public.email_verifications FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

-- Password Resets tablosu için RLS
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own password resets" 
  ON public.password_resets FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own password resets" 
  ON public.password_resets FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

-- Recordings tablosu için RLS
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recordings" 
  ON public.recordings FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own recordings" 
  ON public.recordings FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own recordings" 
  ON public.recordings FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own recordings" 
  ON public.recordings FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Audios tablosu için RLS
ALTER TABLE public.audios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audios" 
  ON public.audios FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own audios" 
  ON public.audios FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own audios" 
  ON public.audios FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Videos tablosu için RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos" 
  ON public.videos FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own videos" 
  ON public.videos FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own videos" 
  ON public.videos FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own videos" 
  ON public.videos FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Conversations tablosu için RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" 
  ON public.conversations FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own conversations" 
  ON public.conversations FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own conversations" 
  ON public.conversations FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Custom Avatars tablosu için RLS
ALTER TABLE public.custom_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom avatars" 
  ON public.custom_avatars FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own custom avatars" 
  ON public.custom_avatars FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own custom avatars" 
  ON public.custom_avatars FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Sentence Banks tablosu için RLS (public read, admin write)
ALTER TABLE public.sentence_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sentence banks" 
  ON public.sentence_banks FOR SELECT 
  TO authenticated
  USING (true);

-- Schema Migrations tablosu için RLS (eğer varsa)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations') THEN
    ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only service role can access schema migrations" 
      ON public.schema_migrations
      USING (false);
  END IF;
END $$;

-- AR Internal Metadata tablosu için RLS (eğer varsa)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ar_internal_metadata') THEN
    ALTER TABLE public.ar_internal_metadata ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only service role can access internal metadata" 
      ON public.ar_internal_metadata
      USING (false);
  END IF;
END $$;

-- =====================================================
-- FIX 2: Fix Function Search Path issues
-- =====================================================

-- update_updated_at_column fonksiyonu için search_path düzelt
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- update_notifications_updated_at fonksiyonu için search_path düzelt
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Bu sorguları çalıştırarak düzeltmelerin başarılı olup olmadığını kontrol edin

-- 1. RLS durumunu kontrol et
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. RLS politikalarını listele
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Fonksiyon search_path ayarlarını kontrol et
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  p.proconfig as config_settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;

-- =====================================================
-- NOTLAR
-- =====================================================
-- 
-- 1. Bu script'i çalıştırmadan önce backup alın!
-- 2. RLS politikaları user_id alanının UUID olduğunu varsayar
-- 3. auth.uid() Supabase authentication kullanır
-- 4. Sentence banks herkese açıktır (authenticated users)
-- 5. Schema migrations ve internal metadata'ya sadece service role erişebilir
-- 
-- ÖNEMLÎ: Eğer backend'iniz Supabase Auth yerine kendi JWT token 
-- sisteminizi kullanıyorsa, politikaları buna göre düzenlemeniz gerekir.
-- 
-- Backend JWT kullanımı için alternatif:
-- USING (current_setting('request.jwt.claims', true)::json->>'sub' = user_id::text)
-- 
-- =====================================================

