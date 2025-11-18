-- =====================================================
-- FIX: user_course_progresses RLS (Row Level Security)
-- =====================================================
-- Bu SQL komutunu Supabase Dashboard > SQL Editor'da çalıştırın
-- 
-- SORUN: user_course_progresses tablosunda RLS disabled
-- ÇÖZÜM: RLS'yi etkinleştir ve gerekli politikaları ekle
-- =====================================================

-- user_course_progresses tablosu için RLS etkinleştir
ALTER TABLE public.user_course_progresses ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (eğer varsa)
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_course_progresses;
DROP POLICY IF EXISTS "Users can create own progress" ON public.user_course_progresses;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_course_progresses;
DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_course_progresses;

-- SELECT Policy: Kullanıcılar sadece kendi progress kayıtlarını görebilir
CREATE POLICY "Users can view own progress"
  ON public.user_course_progresses FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- INSERT Policy: Kullanıcılar sadece kendi progress kayıtlarını oluşturabilir
CREATE POLICY "Users can create own progress"
  ON public.user_course_progresses FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- UPDATE Policy: Kullanıcılar sadece kendi progress kayıtlarını güncelleyebilir
CREATE POLICY "Users can update own progress"
  ON public.user_course_progresses FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- DELETE Policy: Kullanıcılar sadece kendi progress kayıtlarını silebilir
CREATE POLICY "Users can delete own progress"
  ON public.user_course_progresses FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Bu sorguyu çalıştırarak RLS'nin etkinleştirildiğini kontrol edin

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'user_course_progresses';

-- RLS politikalarını kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_course_progresses'
ORDER BY policyname;

