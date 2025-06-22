# AI FAQ Assistant - API Documentation

Complete API reference for the AI FAQ Assistant with examples, response formats, and error handling.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health & Status](#health--status)
  - [Support Queries](#support-queries)
  - [QA Management](#qa-management)
  - [Search & Discovery](#search--discovery)
  - [Admin Functions](#admin-functions)

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

**Note**: Admin endpoints should be protected in production environments.

## ⏱️ Rate Limiting

- **30 requests per minute** per IP address (configurable)
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

**Rate Limit Exceeded Response:**
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 60
}
```

## ❌ Error Handling

### Error Response Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable (QA Engine not ready)

### Validation Errors

```json
{
  "error": "Validation Error",
  "message": "Validation failed",
  "details": [
    {
      "type": "field",
      "value": "Hi",
      "msg": "Question must be a string between 3 and 1000 characters",
      "path": "question",
      "location": "body"
    }
  ]
}
```

## 📡 Endpoints

### Health & Status

#### Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "service": "AI FAQ Assistant",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "qaEngineReady": true,
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  }
}
```

#### System Statistics
```http
GET /support/stats
```

**Response:**
```json
{
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": [
      "account_management",
      "company_info",
      "support",
      "policies",
      "shipping",
      "orders",
      "payment",
      "subscriptions"
    ],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  }
}
```

#### Admin System Status
```http
GET /admin/status
```

**Response:**
```json
{
  "qaEngineReady": true,
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  },
  "uptime": 3600.5,
  "memory": {
    "rss": 123456789,
    "heapTotal": 987654321,
    "heapUsed": 456789123,
    "external": 12345678
  },
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Support Queries

#### Submit Question (Primary Answer)
```http
POST /support/query
Content-Type: application/json

{
  "question": "How do I reset my password?"
}
```

**Response:**
```json
{
  "id": "qa_001",
  "match_question": "How do I reset my password?",
  "answer": "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox.",
  "answer_id": "ans_001_01",
  "confidence": 1,
  "user_question": "How do I reset my password?",
  "category": "account_management",
  "tags": ["password", "login", "security", "account"],
  "total_answers_available": 2
}
```

#### Submit Question (All Answers)
```http
POST /support/query/all-answers
Content-Type: application/json

{
  "question": "How do I reset my password?"
}
```

**Response:**
```json
{
  "id": "qa_001",
  "match_question": "How do I reset my password?",
  "answers": [
    {
      "id": "ans_001_01",
      "answer": "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox.",
      "is_primary": true,
      "tags": ["password", "login", "security"],
      "category": "account_management"
    },
    {
      "id": "ans_001_02",
      "answer": "You can also reset your password by contacting our support team at 1-800-123-4567. They will guide you through the process and may ask for identity verification.",
      "is_primary": false,
      "tags": ["password", "support", "phone"],
      "category": "account_management"
    }
  ],
  "confidence": 1,
  "user_question": "How do I reset my password?",
  "category": "account_management",
  "tags": ["password", "login", "security", "account"]
}
```

### QA Management

#### Get All QA Pairs
```http
GET /support/qa-pairs
```

**Response:**
```json
{
  "qa_pairs": [
    {
      "id": "qa_001",
      "question": "How do I reset my password?",
      "answers": [
        {
          "id": "ans_001_01",
          "answer": "To reset your password...",
          "is_primary": true,
          "tags": ["password", "login", "security"],
          "category": "account_management"
        }
      ],
      "tags": ["password", "login", "security", "account"],
      "category": "account_management",
      "difficulty": "easy",
      "last_updated": "2024-01-15T10:00:00.000Z"
    }
  ],
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  }
}
```

#### Get QA Pair by ID
```http
GET /support/qa-pairs/qa_001
```

**Response:**
```json
{
  "qa_pair": {
    "id": "qa_001",
    "question": "How do I reset my password?",
    "answers": [
      {
        "id": "ans_001_01",
        "answer": "To reset your password...",
        "is_primary": true,
        "tags": ["password", "login", "security"],
        "category": "account_management"
      }
    ],
    "tags": ["password", "login", "security", "account"],
    "category": "account_management",
    "difficulty": "easy",
    "last_updated": "2024-01-15T10:00:00.000Z"
  }
}
```

### Search & Discovery

#### Get All Categories
```http
GET /support/categories
```

**Response:**
```json
{
  "categories": [
    "account_management",
    "company_info",
    "support",
    "policies",
    "shipping",
    "orders",
    "payment",
    "subscriptions"
  ]
}
```

#### Get All Tags
```http
GET /support/tags
```

**Response:**
```json
{
  "tags": [
    "password",
    "login",
    "security",
    "account",
    "support",
    "contact",
    "phone",
    "email",
    "return",
    "policy",
    "shipping",
    "free",
    "tracking",
    "order",
    "payment",
    "credit-cards",
    "subscription",
    "cancel"
  ]
}
```

#### Search by Category
```http
GET /support/search/category/account_management
```

**Response:**
```json
{
  "category": "account_management",
  "qa_pairs": [
    {
      "id": "qa_001",
      "question": "How do I reset my password?",
      "answers": [...],
      "tags": ["password", "login", "security", "account"],
      "category": "account_management",
      "difficulty": "easy",
      "last_updated": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 3
}
```

#### Search by Tags
```http
GET /support/search/tags?tags[]=password&tags[]=security
```

**Response:**
```json
{
  "tags": ["password", "security"],
  "qa_pairs": [
    {
      "id": "qa_001",
      "question": "How do I reset my password?",
      "answers": [...],
      "tags": ["password", "login", "security", "account"],
      "category": "account_management",
      "difficulty": "easy",
      "last_updated": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 2
}
```

### Admin Functions

#### Reload QA Data
```http
POST /admin/reload-data
```

**Response:**
```json
{
  "message": "QA data reloaded successfully",
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  }
}
```

#### Save QA Data
```http
POST /admin/save-data
```

**Response:**
```json
{
  "message": "QA data saved successfully",
  "stats": {
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "unique_tags": 25,
    "average_answers_per_question": "1.80"
  }
}
```

## 🔍 Request Examples

### cURL Examples

#### Health Check
```bash
curl http://localhost:3000/
```

#### Submit Support Query
```bash
curl -X POST http://localhost:3000/support/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I reset my password?"}'
```

#### Get Statistics
```bash
curl http://localhost:3000/support/stats
```

#### Search by Category
```bash
curl http://localhost:3000/support/search/category/account_management
```

#### Search by Tags
```bash
curl "http://localhost:3000/support/search/tags?tags[]=password&tags[]=security"
```

### JavaScript Examples

#### Using Fetch API
```javascript
// Submit a question
const response = await fetch('http://localhost:3000/support/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'How do I reset my password?'
  })
});

const result = await response.json();
console.log(result);
```

#### Using Axios
```javascript
import axios from 'axios';

// Submit a question
const response = await axios.post('http://localhost:3000/support/query', {
  question: 'How do I reset my password?'
});

console.log(response.data);
```

## 📊 Response Fields

### Common Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the QA pair |
| `question` | string | The question text |
| `answer` | string | The primary answer text |
| `answers` | array | Array of all answers for the question |
| `confidence` | number | Similarity score (0-1) |
| `category` | string | Category of the question |
| `tags` | array | Array of tags |
| `difficulty` | string | Difficulty level (easy, medium, hard) |
| `last_updated` | string | ISO timestamp of last update |

### Answer Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the answer |
| `answer` | string | The answer text |
| `is_primary` | boolean | Whether this is the primary answer |
| `tags` | array | Array of tags for this answer |
| `category` | string | Category of this answer |

## 🚨 Error Scenarios

### QA Engine Not Ready
```json
{
  "error": "Service temporarily unavailable",
  "message": "QA Engine is still initializing. Please try again in a few moments."
}
```

### No Match Found
```json
{
  "error": "Not Found",
  "message": "We could not find a relevant answer to your question."
}
```

### Invalid Question
```json
{
  "error": "Validation Error",
  "message": "Validation failed",
  "details": [
    {
      "type": "field",
      "value": "Hi",
      "msg": "Question must be a string between 3 and 1000 characters",
      "path": "question",
      "location": "body"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `HOST` | localhost | Server host |
| `NODE_ENV` | development | Environment |
| `AI_MODEL` | Xenova/all-MiniLM-L6-v2 | AI model name |
| `RATE_LIMIT_MAX` | 30 | Rate limit per minute |
| `QA_DATA_PATH` | ./data/qa_data.json | Path to QA data file |

## 📈 Performance

### Response Times
- **Health Check**: ~1-5ms
- **Support Query**: ~100-500ms (first query may be slower)
- **Statistics**: ~1-10ms
- **Search**: ~10-50ms

### Memory Usage
- **Base Memory**: ~50MB
- **With Model**: ~150-200MB
- **Per QA Pair**: ~1-2MB

## 🔗 Related Documentation

- [Project Structure](../docs/PROJECT_STRUCTURE.md) - Architecture overview
- [Postman Collection](./AI_FAQ_Assistant.postman_collection.json) - Ready-to-use API collection
- [Postman Setup Guide](./POSTMAN_SETUP.md) - Postman configuration guide

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0 