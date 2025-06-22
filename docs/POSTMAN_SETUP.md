# Postman Collection Setup Guide

This guide will help you set up and use the Postman collection for testing the AI FAQ Assistant API.

## 📁 Files Included

1. **`AI_FAQ_Assistant.postman_collection.json`** - Main collection with all API endpoints
2. **`AI_FAQ_Assistant.postman_environment.json`** - Environment variables for different deployment scenarios

## 🚀 Quick Setup

### Step 1: Import the Collection

1. Open **Postman**
2. Click **Import** button (top left)
3. Select **Upload Files** tab
4. Choose `AI_FAQ_Assistant.postman_collection.json`
5. Click **Import**

### Step 2: Import the Environment

1. Click **Import** again
2. Select **Upload Files** tab
3. Choose `AI_FAQ_Assistant.postman_environment.json`
4. Click **Import**

### Step 3: Select Environment

1. In the top-right corner, click the environment dropdown
2. Select **"AI FAQ Assistant Environment"**

## 🔧 Environment Variables

The collection uses these variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3001` | Base URL for the API |
| `port` | `3001` | Server port |
| `host` | `localhost` | Server hostname |
| `protocol` | `http` | Protocol (http/https) |

### Updating for Production

To use with a production server, update the environment variables:

1. Click the environment name in the top-right
2. Click **Edit** (pencil icon)
3. Update the `base_url` value (e.g., `https://your-api.com`)
4. Click **Save**

## 📋 Available Endpoints

### 1. Health Check
- **Method**: `GET`
- **URL**: `{{base_url}}/`
- **Description**: Check if the service is healthy
- **Expected Response**: Service status and version info

### 2. Submit Support Query
- **Method**: `POST`
- **URL**: `{{base_url}}/support/query`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "question": "How do I reset my password?"
  }
  ```
- **Expected Response**: Matched question, answer, and confidence score

### 3. Get All QA Pairs
- **Method**: `GET`
- **URL**: `{{base_url}}/support/qa-pairs`
- **Description**: Get all available question-answer pairs
- **Expected Response**: Array of all QA pairs

## 🧪 Testing Examples

### Example 1: Health Check
1. Select **"Health Check"** request
2. Click **Send**
3. Verify response shows `"status": "healthy"` and `"qaEngineReady": true`

### Example 2: Exact Match Query
1. Select **"Submit Support Query"** request
2. Update the body to:
   ```json
   {
     "question": "How do I reset my password?"
   }
   ```
3. Click **Send**
4. Verify confidence score is `1.0` (exact match)

### Example 3: Semantic Match Query
1. Select **"Submit Support Query"** request
2. Update the body to:
   ```json
   {
     "question": "I forgot my password, what should I do?"
   }
   ```
3. Click **Send**
4. Verify confidence score is around `0.8-0.9` (semantic match)

### Example 4: Validation Error
1. Select **"Submit Support Query"** request
2. Update the body to:
   ```json
   {
     "question": "Hi"
   }
   ```
3. Click **Send**
4. Verify you get a `400 Bad Request` with validation error

## 🔍 Response Examples

### Successful Query Response
```json
{
  "match_question": "How do I reset my password?",
  "answer": "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox.",
  "confidence": 1,
  "user_question": "How do I reset my password?"
}
```

### Health Check Response
```json
{
  "status": "healthy",
  "service": "AI FAQ Assistant",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "qaEngineReady": true
}
```

### Validation Error Response
```json
{
  "error": "Validation failed",
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

## 🎯 Test Scripts

The collection includes automatic test scripts that validate:

- ✅ Status code is 200
- ✅ Response time is less than 5000ms
- ✅ Response has JSON content type

## 🔄 Running the Collection

### Individual Requests
1. Select any request from the collection
2. Click **Send**
3. View response in the bottom panel

### Run Entire Collection
1. Click the collection name (three dots menu)
2. Select **Run collection**
3. Choose environment
4. Click **Run AI FAQ Assistant**

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure the AI FAQ Assistant server is running
   - Check if the port is correct in environment variables

2. **404 Not Found**
   - Verify the `base_url` is correct
   - Check if the server is running on the expected port

3. **500 Internal Server Error**
   - Check server logs for detailed error messages
   - Ensure the embedding model has loaded successfully

4. **503 Service Unavailable**
   - The QA Engine might still be initializing
   - Wait a few moments and try again

### Debug Steps

1. **Check Server Status**
   ```bash
   curl http://localhost:3001/
   ```

2. **Verify Environment Variables**
   - In Postman, click the environment name
   - Verify `base_url` is set correctly

3. **Check Server Logs**
   - Look at the terminal where you started the server
   - Check for any error messages

## 📊 Performance Testing

### Load Testing with Postman
1. Use **Postman Runner** to run multiple requests
2. Set iterations to test concurrent requests
3. Monitor response times and success rates

### Rate Limiting Test
1. Send 30+ requests rapidly
2. Verify you get rate limit error after 30 requests per minute
3. Wait 1 minute and try again

## 🔐 Security Testing

The collection can be used to test:

- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS headers
- ✅ Security headers (Helmet)

## 📝 Customization

### Adding New Test Cases
1. Duplicate existing requests
2. Modify the request body
3. Add custom test scripts
4. Save to the collection

### Environment-Specific Variables
Create multiple environments for:
- **Development**: `http://localhost:3001`
- **Staging**: `https://staging-api.com`
- **Production**: `https://api.com`

---

**Happy Testing! 🎉** 