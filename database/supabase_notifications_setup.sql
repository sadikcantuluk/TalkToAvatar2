-- ===================================
-- SUPABASE NOTIFICATIONS TABLE SETUP
-- ===================================
-- Bu SQL komutlarını Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Notifications tablosunu oluştur
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. İndeksler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- 3. RLS (Row Level Security) politikaları ekle
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi bildirimlerini oluşturabilir
CREATE POLICY "Users can create own notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi bildirimlerini güncelleyebilir
CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi bildirimlerini silebilir
CREATE POLICY "Users can delete own notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- 5. Bildirim tipi check constraint
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('success', 'error', 'info', 'warning', 'video_ready'));

-- ===================================
-- TEST VERİLERİ (Opsiyonel - Geliştirme için)
-- ===================================
-- Aşağıdaki komutları test etmek için kullanabilirsiniz
-- NOT: user_id'yi gerçek bir kullanıcı ID'si ile değiştirin

-- Test bildirimi ekle
-- INSERT INTO notifications (user_id, title, message, type) 
-- VALUES (
--   'YOUR_USER_ID_HERE',
--   'Welcome to TalkToAvatar',
--   'Your account has been created successfully!',
--   'success'
-- );

-- Bildirimleri görüntüle
-- SELECT * FROM notifications WHERE user_id = 'YOUR_USER_ID_HERE' ORDER BY created_at DESC;

-- Okunmamış bildirimleri say
-- SELECT COUNT(*) FROM notifications WHERE user_id = 'YOUR_USER_ID_HERE' AND read = FALSE;

