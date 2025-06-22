# AI FAQ Assistant

A production-ready, modular AI FAQ Assistant that uses semantic search to find the most relevant answers to user questions. Built with Node.js, Express, and the `all-MiniLM-L6-v2` model for high-quality semantic embeddings.

## 🏗️ Architecture

This project follows a **modular, production-ready architecture** with clear separation of concerns:

- **MVC Pattern with Service Layer**: Models, Controllers, Services, and Routes
- **Configuration Management**: Centralized environment-based configuration
- **Error Handling**: Comprehensive error handling with custom error classes
- **Validation**: Request validation and sanitization
- **Security**: Built-in security middleware (Helmet, CORS, Rate Limiting)
- **Monitoring**: Health checks, statistics, and system monitoring

## 📁 Project Structure

```
ai-faq-assistant/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   ├── controllers/              # Request handlers
│   ├── middleware/               # Express middleware
│   ├── models/                   # Data models
│   ├── routes/                   # Route definitions
│   ├── services/                 # Business logic
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── data/                         # Data files
├── docs/                         # Documentation
├── tests/                        # Test files
└── package.json                  # Dependencies and scripts
```

## ✨ Features

- **Semantic Search**: Uses cosine similarity to find the most relevant question-answer pairs
- **Multiple Answers**: Support for multiple answers per question with primary answer designation
- **Categories & Tags**: Organized knowledge base with categories and tags
- **Production Ready**: Security middleware, rate limiting, error handling
- **Modular Design**: Clean, maintainable, and extensible codebase
- **Configuration Management**: Environment-based configuration
- **Monitoring**: Health checks, statistics, and system status
- **Hot Reloading**: Reload QA data without restarting the server

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-faq-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## 📋 API Endpoints

### Health & Status
- `GET /` - Health check
- `GET /support/stats` - System statistics
- `GET /admin/status` - Detailed system status

### Support Queries
- `POST /support/query` - Submit question (returns primary answer)
- `POST /support/query/all-answers` - Submit question (returns all answers)

### QA Management
- `GET /support/qa-pairs` - Get all QA pairs
- `GET /support/qa-pairs/:id` - Get specific QA pair

### Search & Discovery
- `GET /support/search/category/:category` - Search by category
- `GET /support/search/tags` - Search by tags
- `GET /support/categories` - Get all categories
- `GET /support/tags` - Get all tags

### Admin Functions
- `POST /admin/reload-data` - Reload QA data
- `POST /admin/save-data` - Save QA data

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# AI Model Configuration
AI_MODEL=Xenova/all-MiniLM-L6-v2

# Rate Limiting
RATE_LIMIT_MAX=30

# Data Configuration
QA_DATA_PATH=./data/qa_data.json
```

### Configuration Hierarchy

1. **Environment Variables** (highest priority)
2. **Default Values** (fallback)
3. **Hard-coded Values** (lowest priority)

## 📊 Data Structure

The QA data supports multiple answers per question:

```json
{
  "id": "qa_001",
  "question": "How do I reset my password?",
  "answers": [
    {
      "id": "ans_001_01",
      "answer": "To reset your password...",
      "is_primary": true,
      "tags": ["password", "login"],
      "category": "account_management"
    },
    {
      "id": "ans_001_02",
      "answer": "Alternative method...",
      "is_primary": false,
      "tags": ["password", "support"],
      "category": "account_management"
    }
  ],
  "tags": ["password", "login", "security"],
  "category": "account_management",
  "difficulty": "easy",
  "last_updated": "2024-01-15T10:00:00.000Z"
}
```

## 🧪 Testing

### Example Requests

**Health Check:**
```bash
curl http://localhost:3000/
```

**Submit Query:**
```bash
curl -X POST http://localhost:3000/support/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I reset my password?"}'
```

**Get Statistics:**
```bash
curl http://localhost:3000/support/stats
```

**Search by Category:**
```bash
curl http://localhost:3000/support/search/category/account_management
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protection against abuse (30 requests/minute)
- **Input Validation**: Request sanitization and validation
- **Error Handling**: Secure error responses
- **Request Logging**: Basic request logging

## 📈 Monitoring & Observability

### Built-in Monitoring
- Health check endpoints
- System statistics
- Memory usage tracking
- Uptime monitoring
- Request logging

### Metrics Available
- Total questions and answers
- Categories and tags
- Average answers per question
- System performance metrics

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=3000
   RATE_LIMIT_MAX=100
   ```

2. **Security Hardening**
   - Enable HTTPS
   - Configure CORS properly
   - Set up monitoring
   - Use environment variables

3. **Performance Optimization**
   - Enable caching
   - Optimize AI model loading
   - Configure connection pooling

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Platforms

This application can be deployed to:
- **Heroku**: Just push to your Heroku git repository
- **Railway**: Connect your GitHub repository
- **Vercel**: Deploy as a Node.js function
- **AWS/GCP/Azure**: Use container services or app platforms

## 🔄 Customization

### Adding New QA Pairs

Edit the `data/qa_data.json` file:

```json
{
  "id": "qa_new",
  "question": "Your new question?",
  "answers": [
    {
      "id": "ans_new_01",
      "answer": "Your answer here.",
      "is_primary": true,
      "tags": ["tag1", "tag2"],
      "category": "your_category"
    }
  ],
  "tags": ["tag1", "tag2"],
  "category": "your_category",
  "difficulty": "easy"
}
```

### Changing the AI Model

Update the `AI_MODEL` environment variable:

```bash
AI_MODEL=your-model-name
```

### Adding New Endpoints

1. Create a new controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Register routes in `src/app.js`

## 🛠️ Development

### Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-restart
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Project Structure Details

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed architecture documentation.

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed architecture overview
- [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [Postman Collection](AI_FAQ_Assistant.postman_collection.json) - Ready-to-use API collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ using Node.js, Express, and Transformers.js**

*This modular, production-ready AI FAQ Assistant provides a solid foundation for building intelligent support systems with semantic search capabilities.* 