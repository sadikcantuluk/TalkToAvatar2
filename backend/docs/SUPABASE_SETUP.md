# Supabase Setup Guide

This guide will help you set up Supabase for the TalkToAvatar Sualingo Mode backend.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: talktoavatar-sualingo
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

## Step 2: Get Your Credentials

Once the project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJxxx...` (for frontend)
   - **service_role key**: `eyJxxx...` (for backend, keep secret!)

3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

## Step 3: Create Database Tables

Run the following SQL in Supabase SQL Editor (**SQL Editor** → **New query**):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_url VARCHAR NOT NULL,
  transcript TEXT NOT NULL,
  reference_text TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  level VARCHAR NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sentence banks table
CREATE TABLE sentence_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  language VARCHAR NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_recordings_user_id ON recordings(user_id);
CREATE INDEX idx_recordings_level ON recordings(level);
CREATE INDEX idx_recordings_created_at ON recordings(created_at);
CREATE INDEX idx_sentence_banks_level_language ON sentence_banks(level, language);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at BEFORE UPDATE ON recordings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentence_banks_updated_at BEFORE UPDATE ON sentence_banks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Set Up Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create a bucket named: `sualingo-recordings`
4. Set it as **Public** (so URLs are accessible)
5. Click **Save**

### Configure Storage Policies

Go to **Storage** → **Policies** → `sualingo-recordings` bucket

Add these policies:

**Policy 1: Allow public read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'sualingo-recordings' );
```

**Policy 2: Allow authenticated upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'sualingo-recordings' );
```

**Policy 3: Allow users to delete their own recordings**
```sql
CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
USING ( bucket_id = 'sualingo-recordings' );
```

## Step 5: Configure Row Level Security (RLS)

Enable RLS on tables:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_banks ENABLE ROW LEVEL SECURITY;

-- Users: Anyone can create, users can read their own
CREATE POLICY "Users can create accounts"
ON users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid()::text = id::text OR true);

-- Recordings: Users can manage their own recordings
CREATE POLICY "Users can create recordings"
ON recordings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can read own recordings"
ON recordings FOR SELECT
USING (true);

CREATE POLICY "Users can delete own recordings"
ON recordings FOR DELETE
USING (user_id = auth.uid() OR true);

-- Sentence banks: Public read access
CREATE POLICY "Anyone can read sentences"
ON sentence_banks FOR SELECT
USING (true);
```

## Step 6: Update Environment Variables

Create/update your `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Rails Configuration
RAILS_ENV=development
```

## Step 7: Test Connection

1. In your backend directory, run:
```bash
bundle install
rails db:migrate
rails db:seed
```

2. Start the Rails server:
```bash
rails server
```

3. Test the API:
```bash
curl http://localhost:3000/api/v1/sentences?level=A1&language=en
```

You should see a JSON response with sentences.

## Step 8: Frontend Configuration

Update your React Native `.env` file:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
RAILS_API_URL=http://localhost:3000/api/v1
OPENAI_API_KEY=your_openai_api_key
FAL_API_KEY=your_fal_api_key
GOOGLE_AI_API_KEY=your_google_ai_key
```

**Important for Development:**
- If testing on a physical device, replace `localhost` with your computer's local IP address
- Example: `RAILS_API_URL=http://192.168.1.100:3000/api/v1`

## Troubleshooting

### Connection Errors

- Verify your Supabase URL and keys are correct
- Check if your IP is whitelisted (for production)
- Ensure the database is running

### Storage Upload Errors

- Verify the bucket name is correct (`sualingo-recordings`)
- Check bucket policies are properly configured
- Ensure the bucket is set to public

### RLS Issues

- If queries are blocked, review your RLS policies
- For development, you can temporarily disable RLS:
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  ```
- Remember to re-enable RLS in production!

## Production Deployment

When deploying to production:

1. **Update CORS settings** in `config/initializers/cors.rb`
   - Replace `origins '*'` with your production domain
   
2. **Use SSL** for database connections
   - Add `?sslmode=require` to your DATABASE_URL

3. **Secure your keys**
   - Never commit `.env` file to git
   - Use environment variables on your hosting platform
   - Rotate keys regularly

4. **Enable RLS** on all tables
   - Review and tighten security policies
   - Test thoroughly before going live

## Next Steps

- Populate `sentence_banks` table with more sentences
- Set up authentication for users
- Configure CDN for audio files
- Set up monitoring and logging
- Implement rate limiting

