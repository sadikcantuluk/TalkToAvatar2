# TalkToAvatar Backend API Documentation

Base URL: `http://localhost:3000/api/v1` (development)

All responses are in JSON format.

## Authentication

Currently, the API does not require authentication. In production, you should implement authentication using Supabase Auth or JWT tokens.

## Endpoints

### Health Check

Check if the API is running.

**GET** `/health`

**Response:**
```
OK
```

---

### Users

#### Create or Get User

Create a new user or return existing user by email.

**POST** `/api/v1/users`

**Request Body:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-01-05T10:00:00.000Z",
  "updated_at": "2025-01-05T10:00:00.000Z"
}
```

---

### Sentences

#### Get Sentences by Level

Retrieve practice sentences for a specific language level.

**GET** `/api/v1/sentences?level={level}&language={language}`

**Query Parameters:**
- `level` (required): Language level (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`)
- `language` (optional): Language code (default: `en`)

**Example:**
```
GET /api/v1/sentences?level=A1&language=en
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "text": "Hello, my name is John.",
    "level": "A1",
    "language": "en"
  },
  {
    "id": "uuid",
    "text": "I like coffee.",
    "level": "A1",
    "language": "en"
  }
]
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Invalid level"
}
```

---

### Recordings

#### Create Recording

Save a new pronunciation recording.

**POST** `/api/v1/recordings`

**Request Body:**
```json
{
  "recording": {
    "user_id": "uuid",
    "audio_url": "https://supabase.co/storage/...",
    "transcript": "Hello, my name is John.",
    "reference_text": "Hello, my name is John.",
    "score": 95,
    "level": "A1"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "audio_url": "https://supabase.co/storage/...",
  "transcript": "Hello, my name is John.",
  "reference_text": "Hello, my name is John.",
  "score": 95,
  "level": "A1",
  "created_at": "2025-01-05T10:00:00.000Z",
  "updated_at": "2025-01-05T10:00:00.000Z"
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "error": ["Score must be between 0 and 100"]
}
```

---

#### Get User Recordings

Retrieve all recordings for a specific user.

**GET** `/api/v1/recordings/:user_id`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "audio_url": "https://...",
    "transcript": "Hello, my name is John.",
    "reference_text": "Hello, my name is John.",
    "score": 95,
    "level": "A1",
    "created_at": "2025-01-05T10:00:00.000Z",
    "updated_at": "2025-01-05T10:00:00.000Z"
  }
]
```

---

#### Delete Recording

Delete a specific recording.

**DELETE** `/api/v1/recordings/:id`

**Response:** `204 No Content`

---

### Audio Processing

#### Upload Audio File

Upload an audio file to Supabase storage.

**POST** `/api/v1/upload_audio`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `audio` (file)

**Response:** `200 OK`
```json
{
  "url": "https://supabase.co/storage/sualingo-recordings/uuid_timestamp.m4a"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "No audio file provided"
}
```

---

#### Evaluate Pronunciation

Transcribe audio using OpenAI Whisper and calculate pronunciation score.

**POST** `/api/v1/evaluate`

**Request Body:**
```json
{
  "audio_url": "https://supabase.co/storage/...",
  "reference_text": "Hello, my name is John."
}
```

**Response:** `200 OK`
```json
{
  "transcript": "Hello, my name is John.",
  "score": 95,
  "feedback": "Excellent! Your pronunciation is nearly perfect."
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "error": "Failed to evaluate pronunciation"
}
```

---

## Error Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production.

## Example Usage

### JavaScript/React Native

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// Get sentences
const getSentences = async (level, language = 'en') => {
  const response = await axios.get(`${API_URL}/sentences`, {
    params: { level, language }
  });
  return response.data;
};

// Create user
const createUser = async (name, email) => {
  const response = await axios.post(`${API_URL}/users`, {
    user: { name, email }
  });
  return response.data;
};

// Upload audio
const uploadAudio = async (audioUri) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  });

  const response = await axios.post(`${API_URL}/upload_audio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.url;
};

// Evaluate pronunciation
const evaluatePronunciation = async (audioUrl, referenceText) => {
  const response = await axios.post(`${API_URL}/evaluate`, {
    audio_url: audioUrl,
    reference_text: referenceText
  });
  return response.data;
};
```

### cURL Examples

```bash
# Get sentences
curl "http://localhost:3000/api/v1/sentences?level=A1&language=en"

# Create user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"name":"John Doe","email":"john@example.com"}}'

# Evaluate pronunciation
curl -X POST http://localhost:3000/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://...",
    "reference_text": "Hello, my name is John."
  }'
```

