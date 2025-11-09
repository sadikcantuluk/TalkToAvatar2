-- TalkToAvatar Database Schema for Supabase
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- USERS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_digest VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ==================================================
-- EMAIL VERIFICATIONS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_code ON email_verifications(code);

-- ==================================================
-- PASSWORD RESETS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_token ON password_resets(token);

-- ==================================================
-- SENTENCE BANK TABLE (For Sualingo Mode)
-- ==================================================
CREATE TABLE IF NOT EXISTS sentence_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(2) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    language_code VARCHAR(5) NOT NULL,
    sentence TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sentence_banks_level ON sentence_banks(level);
CREATE INDEX idx_sentence_banks_language ON sentence_banks(language_code);

-- ==================================================
-- RECORDINGS TABLE (For Sualingo Mode)
-- ==================================================
CREATE TABLE IF NOT EXISTS recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_uri TEXT NOT NULL,
    transcript TEXT,
    reference_text TEXT,
    score DECIMAL(5,2),
    level VARCHAR(2) CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    language_code VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recordings_user_id ON recordings(user_id);
CREATE INDEX idx_recordings_level ON recordings(level);
CREATE INDEX idx_recordings_language ON recordings(language_code);

-- ==================================================
-- AUDIOS TABLE (For TTS Mode)
-- ==================================================
CREATE TABLE IF NOT EXISTS audios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_uri TEXT NOT NULL,
    text TEXT NOT NULL,
    translated_text TEXT,
    voice_type VARCHAR(100),
    language_code VARCHAR(5),
    avatar_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audios_user_id ON audios(user_id);
CREATE INDEX idx_audios_language ON audios(language_code);

-- ==================================================
-- VIDEOS TABLE (For Avatar to Video Mode)
-- ==================================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_uri TEXT,
    avatar_info JSONB,
    text TEXT NOT NULL,
    audio_info JSONB,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_status ON videos(status);

-- ==================================================
-- CONVERSATIONS TABLE (For Travel Assistant Mode)
-- ==================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_text TEXT NOT NULL,
    translated_text TEXT,
    user_language VARCHAR(5),
    target_language VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_language ON conversations(user_language);
CREATE INDEX idx_conversations_target_language ON conversations(target_language);

-- ==================================================
-- CUSTOM AVATARS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS custom_avatars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_uri TEXT NOT NULL,
    avatar_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_avatars_user_id ON custom_avatars(user_id);

-- ==================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_verifications_updated_at BEFORE UPDATE ON email_verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_password_resets_updated_at BEFORE UPDATE ON password_resets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentence_banks_updated_at BEFORE UPDATE ON sentence_banks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON recordings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audios_updated_at BEFORE UPDATE ON audios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_avatars_updated_at BEFORE UPDATE ON custom_avatars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- SAMPLE DATA FOR SENTENCE BANK (Optional)
-- ==================================================
-- A1 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'en', 'Hello, how are you?'),
('A1', 'en', 'My name is John.'),
('A1', 'en', 'Where is the bathroom?'),
('A1', 'en', 'I like pizza.'),
('A1', 'en', 'What time is it?');

-- A2 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'en', 'I am learning English every day.'),
('A2', 'en', 'Can you help me find the train station?'),
('A2', 'en', 'I went to the market yesterday.'),
('A2', 'en', 'The weather is beautiful today.'),
('A2', 'en', 'How much does this cost?');

-- B1 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'en', 'I have been studying English for three years.'),
('B1', 'en', 'Could you recommend a good restaurant nearby?'),
('B1', 'en', 'I enjoy reading books in my free time.'),
('B1', 'en', 'The movie was more interesting than I expected.'),
('B1', 'en', 'I would like to make a reservation for two people.');

-- B2 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'en', 'Despite the challenges, we managed to complete the project on time.'),
('B2', 'en', 'The government should invest more in renewable energy sources.'),
('B2', 'en', 'She has been working on her thesis for the past six months.'),
('B2', 'en', 'If I had known about the traffic, I would have left earlier.'),
('B2', 'en', 'The consequences of climate change are becoming increasingly evident.');

-- C1 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'en', 'The implementation of this policy requires careful consideration of various stakeholders.'),
('C1', 'en', 'Not only did she excel academically, but she also contributed significantly to community service.'),
('C1', 'en', 'The intricate relationship between economic growth and environmental sustainability remains contentious.'),
('C1', 'en', 'Having thoroughly analyzed the data, we can confidently assert that the hypothesis holds true.'),
('C1', 'en', 'The nuances of intercultural communication often elude those who lack sufficient exposure.');

-- C2 Level English Sentences
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'en', 'The paradigm shift in cognitive psychology has profound implications for our understanding of human behavior.'),
('C2', 'en', 'Notwithstanding the compelling evidence, some scholars remain skeptical of the proposed theoretical framework.'),
('C2', 'en', 'The juxtaposition of traditional and contemporary art forms creates a rich tapestry of cultural expression.'),
('C2', 'en', 'Her erudite discourse on postmodern literature captivated the audience and sparked heated debate.'),
('C2', 'en', 'The multifaceted nature of globalization necessitates a comprehensive approach to policy formulation.');

-- ==================================================
-- COMPLETION MESSAGE
-- ==================================================
-- Schema created successfully!
-- Don't forget to:
-- 1. Set up Row Level Security (RLS) policies
-- 2. Configure environment variables in your Rails app
-- 3. Run 'bundle install' in the backend directory
-- 4. Create a .env file with your credentials

