-- Practice Sentences Tablosu Oluşturma
-- Bu tablo, course practice sistemi için hazır cümleleri tutar

CREATE TABLE IF NOT EXISTS practice_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(2) NOT NULL,
  level VARCHAR(2) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  topic VARCHAR(50) NOT NULL,
  sentence TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_practice_sentences_language ON practice_sentences(language_code);
CREATE INDEX IF NOT EXISTS idx_practice_sentences_level ON practice_sentences(level);
CREATE INDEX IF NOT EXISTS idx_practice_sentences_topic ON practice_sentences(topic);
CREATE INDEX IF NOT EXISTS idx_practice_sentences_composite ON practice_sentences(language_code, level, topic);

-- User Course Progress Tablosu
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sentence_id UUID NOT NULL REFERENCES practice_sentences(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score FLOAT,
  attempts INTEGER DEFAULT 0,
  best_score FLOAT,
  last_practiced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id, sentence_id)
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_sentence ON user_course_progress(sentence_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_composite ON user_course_progress(user_id, course_id);

-- RLS Policies
ALTER TABLE practice_sentences ENABLE ROW LEVEL SECURITY;

-- Herkes practice sentences'ları görebilir (public data)
CREATE POLICY "Anyone can view practice sentences"
  ON practice_sentences FOR SELECT
  USING (true);

-- User course progress RLS
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own progress"
  ON user_course_progress FOR DELETE
  USING (auth.uid()::text = user_id::text);

