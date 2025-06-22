# AI FAQ Assistant - Project Structure

This document describes the modular, production-ready architecture of the AI FAQ Assistant.

## 📁 Directory Structure

```
ai-faq-assistant/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── index.js             # Main configuration
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Request handlers
│   │   ├── supportController.js # Support-related endpoints
│   │   └── adminController.js   # Admin endpoints
│   ├── middleware/              # Express middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Request validation
│   ├── models/                  # Data models
│   │   └── QA.js               # Question-Answer model
│   ├── routes/                  # Route definitions
│   │   ├── supportRoutes.js     # Support routes
│   │   └── adminRoutes.js       # Admin routes
│   ├── services/                # Business logic
│   │   └── QAEngine.js         # AI/ML service
│   ├── utils/                   # Utility functions
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── data/                        # Data files
│   └── qa_data.json            # Question-answer data
├── docs/                        # Documentation
│   ├── PROJECT_STRUCTURE.md    # This file
│   └── API_DOCUMENTATION.md    # API documentation
├── tests/                       # Test files
├── .env.example                 # Environment variables example
├── package.json                 # Dependencies and scripts
└── README.md                    # Project overview
```

## 🏗️ Architecture Overview

### **MVC Pattern with Service Layer**

The application follows a modified MVC (Model-View-Controller) pattern with an additional service layer:

- **Models**: Data structures and validation logic
- **Controllers**: Request/response handling
- **Services**: Business logic and external integrations
- **Routes**: URL routing and middleware composition

### **Separation of Concerns**

Each module has a single responsibility:

- **Config**: Centralized configuration management
- **Middleware**: Cross-cutting concerns (validation, error handling)
- **Controllers**: HTTP request/response handling
- **Services**: Business logic and AI/ML operations
- **Models**: Data structure definitions
- **Routes**: URL routing and endpoint organization

## 📋 Module Details

### **Configuration (`src/config/`)**

#### `index.js`
- Centralized configuration management
- Environment variable handling
- Default values for all settings
- Security, rate limiting, and AI model configuration

#### `database.js`
- Database connection settings
- Redis configuration for caching
- File storage configuration
- Future database integration preparation

### **Models (`src/models/`)**

#### `QA.js`
- Question-Answer data structure
- Validation methods
- CRUD operations for QA pairs
- Tag and category management
- JSON serialization/deserialization

**Key Features:**
- Multiple answers per question support
- Primary answer designation
- Tag and category management
- Data validation
- Immutable operations

### **Services (`src/services/`)**

#### `QAEngine.js`
- AI/ML model management
- Semantic search implementation
- Embedding generation and similarity calculation
- Data loading and persistence
- Statistics and analytics

**Key Features:**
- Dynamic model loading
- Cosine similarity calculation
- Multiple answer support
- Category and tag-based search
- Data reloading capabilities

### **Controllers (`src/controllers/`)**

#### `supportController.js`
- Support query handling
- Health check endpoints
- Search and retrieval operations
- Statistics and metadata endpoints

#### `adminController.js`
- Administrative functions
- Data reloading
- System status monitoring
- Data persistence operations

### **Middleware (`src/middleware/`)**

#### `errorHandler.js`
- Centralized error handling
- Custom error classes
- Error response formatting
- Development vs production error details
- Async error wrapper

#### `validation.js`
- Request validation rules
- Input sanitization
- Validation middleware composition
- Custom validation error handling

### **Routes (`src/routes/`)**

#### `supportRoutes.js`
- Support-related endpoints
- Validation middleware integration
- Route organization by functionality

#### `adminRoutes.js`
- Administrative endpoints
- System management routes
- Data management operations

### **Application (`src/app.js`)**

#### Main Application Class
- Express app configuration
- Middleware setup
- Route registration
- Error handling setup
- QA Engine integration

### **Server (`src/server.js`)**

#### Server Management
- Application initialization
- QA Engine startup
- Graceful shutdown handling
- Process signal management
- Error handling and logging

## 🔧 Configuration Management

### **Environment Variables**

The application uses environment variables for configuration:

```bash
# Server
PORT=3000
HOST=localhost
NODE_ENV=development

# AI Model
AI_MODEL=Xenova/all-MiniLM-L6-v2

# Rate Limiting
RATE_LIMIT_MAX=30

# Data
QA_DATA_PATH=./data/qa_data.json
```

### **Configuration Hierarchy**

1. **Environment Variables** (highest priority)
2. **Default Values** (fallback)
3. **Hard-coded Values** (lowest priority)

## 🚀 Application Lifecycle

### **1. Initialization**
```javascript
// Server startup sequence
1. Load configuration
2. Initialize QA Engine
3. Load AI model
4. Load QA data
5. Generate embeddings
6. Setup Express app
7. Register routes
8. Start HTTP server
```

### **2. Request Flow**
```javascript
// Request processing sequence
1. Request received
2. Middleware processing (CORS, Helmet, Rate Limiting)
3. Route matching
4. Validation middleware
5. Controller execution
6. Service layer processing
7. Response formatting
8. Error handling (if needed)
```

### **3. Shutdown**
```javascript
// Graceful shutdown sequence
1. Signal received (SIGTERM/SIGINT)
2. Stop accepting new requests
3. Complete ongoing requests
4. Close database connections
5. Cleanup resources
6. Exit process
```

## 🔒 Security Features

### **Built-in Security**
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request sanitization
- **Error Handling**: Secure error responses

### **Production Considerations**
- Environment-based configuration
- Secure error handling
- Request logging
- Graceful error recovery
- Resource cleanup

## 📊 Monitoring and Logging

### **Built-in Monitoring**
- Health check endpoints
- System statistics
- Memory usage tracking
- Uptime monitoring
- Request logging

### **Observability**
- Request/response logging
- Error tracking
- Performance metrics
- System status endpoints

## 🧪 Testing Structure

### **Test Organization**
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

### **Testing Strategy**
- Unit tests for individual modules
- Integration tests for API endpoints
- E2E tests for complete workflows
- Mock external dependencies

## 🔄 Data Management

### **Data Structure**
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
          "tags": ["password", "login"],
          "category": "account_management"
        }
      ],
      "tags": ["password", "login", "security"],
      "category": "account_management",
      "difficulty": "easy",
      "last_updated": "2024-01-15T10:00:00.000Z"
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "total_questions": 10,
    "total_answers": 18,
    "categories": ["account_management", "support"],
    "last_updated": "2024-01-15T10:00:00.000Z"
  }
}
```

### **Data Operations**
- **Loading**: JSON file loading with validation
- **Saving**: Automatic data persistence
- **Reloading**: Hot reloading without restart
- **Validation**: Data integrity checks
- **Backup**: Automatic backup creation

## 🚀 Deployment Considerations

### **Production Setup**
1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set up monitoring and logging

2. **Security Hardening**
   - Enable all security middleware
   - Configure CORS properly
   - Set up rate limiting
   - Use HTTPS

3. **Performance Optimization**
   - Enable caching
   - Optimize AI model loading
   - Configure connection pooling
   - Set up load balancing

4. **Monitoring and Alerting**
   - Health check endpoints
   - Performance metrics
   - Error tracking
   - Log aggregation

### **Containerization**
- Docker support ready
- Environment variable configuration
- Health check endpoints
- Graceful shutdown handling

## 📈 Scalability Features

### **Horizontal Scaling**
- Stateless application design
- External data storage
- Load balancer ready
- Session management

### **Vertical Scaling**
- Memory optimization
- CPU utilization monitoring
- Resource cleanup
- Performance profiling

### **Future Enhancements**
- Database integration
- Caching layer
- Message queues
- Microservices architecture

---

This modular structure provides a solid foundation for a production-ready AI FAQ Assistant with clear separation of concerns, maintainable code, and extensible architecture. 