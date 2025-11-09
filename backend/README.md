# TalkToAvatar Backend - Sualingo Mode

Ruby on Rails backend for the Sualingo pronunciation learning mode.

## Tech Stack

- Ruby on Rails 7.x
- Supabase (PostgreSQL + Storage)
- OpenAI Whisper API
- RESTful API

## Features

- User management
- Sentence bank by language levels (A1-C2)
- Audio recording storage (Supabase)
- Pronunciation scoring using OpenAI Whisper
- Recording history

## Setup Instructions

### Prerequisites

- Ruby 3.2+
- Rails 7.x
- PostgreSQL (via Supabase)
- OpenAI API Key

### Installation

1. Install dependencies:
```bash
bundle install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
```

3. Setup database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. Start server:
```bash
rails server -p 3000
```

The API will be available at `http://localhost:3000/api/v1`

## API Endpoints

### Sentences

- `GET /api/v1/sentences?level=A1&language=en` - Get sentences by level and language

### Users

- `POST /api/v1/users` - Create or get user

### Recordings

- `POST /api/v1/recordings` - Create new recording
- `GET /api/v1/recordings/:user_id` - Get user's recordings
- `DELETE /api/v1/recordings/:id` - Delete recording

### Audio Upload

- `POST /api/v1/upload_audio` - Upload audio file to Supabase storage

### Pronunciation Evaluation

- `POST /api/v1/evaluate` - Evaluate pronunciation using Whisper

## Database Schema

### Users Table
- id (UUID, primary key)
- name (string)
- email (string)
- created_at (timestamp)
- updated_at (timestamp)

### Recordings Table
- id (UUID, primary key)
- user_id (UUID, foreign key)
- audio_url (string)
- transcript (text)
- reference_text (text)
- score (integer)
- level (string)
- created_at (timestamp)
- updated_at (timestamp)

### SentenceBank Table
- id (UUID, primary key)
- level (string)
- language (string)
- text (text)
- created_at (timestamp)
- updated_at (timestamp)

## Supabase Configuration

1. Create a new Supabase project
2. Create tables using the schema above
3. Enable Row Level Security (RLS) policies
4. Create a storage bucket named `sualingo-recordings`
5. Set bucket permissions for authenticated users

## Development

Run tests:
```bash
rails test
```

Run console:
```bash
rails console
```

## Deployment

The backend can be deployed to:
- Heroku
- Railway
- Render
- AWS
- Any Rails-compatible hosting

Make sure to set environment variables on your hosting platform.

