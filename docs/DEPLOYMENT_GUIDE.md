# AI FAQ Assistant - Deployment Guide

Complete guide for deploying the AI FAQ Assistant to various environments including development, staging, and production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Considerations](#production-considerations)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Memory**: Minimum 512MB RAM (2GB recommended)
- **Storage**: Minimum 1GB free space
- **Network**: Internet connection for model download

### Required Software

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 8.0.0

# Install PM2 for production process management
npm install -g pm2
```

## 🌍 Environment Setup

### Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=production

# AI Model Configuration
AI_MODEL=Xenova/all-MiniLM-L6-v2
MODEL_CACHE_DIR=./models

# Rate Limiting
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW_MS=60000

# Data Configuration
QA_DATA_PATH=./data/qa_data.json

# Security
CORS_ORIGIN=*
HELMET_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

#### Staging
```bash
NODE_ENV=staging
LOG_LEVEL=info
CORS_ORIGIN=https://staging.yourdomain.com
```

#### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
```

## 🏠 Local Development

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd ai-faq-assistant

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Setup Environment**
   ```bash
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test API Endpoints**
   ```bash
   # Health check
   curl http://localhost:3000/
   
   # Submit a question
   curl -X POST http://localhost:3000/support/query \
     -H "Content-Type: application/json" \
     -d '{"question": "How do I reset my password?"}'
   ```

4. **Monitor Logs**
   ```bash
   # View application logs
   tail -f logs/app.log
   ```

## 🐳 Docker Deployment

### Dockerfile

The project includes a production-ready Dockerfile:

```dockerfile
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  ai-faq-assistant:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - AI_MODEL=Xenova/all-MiniLM-L6-v2
      - RATE_LIMIT_MAX=100
    volumes:
      - ./data:/app/data
      - ./models:/app/models
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - ai-faq-assistant
    restart: unless-stopped
```

### Docker Commands

```bash
# Build and run with Docker
docker build -t ai-faq-assistant .
docker run -p 3000:3000 ai-faq-assistant

# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## ☁️ Cloud Deployment

### AWS Deployment

#### EC2 Instance

1. **Launch EC2 Instance**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd ai-faq-assistant
   
   # Install dependencies
   npm install
   
   # Setup environment
   cp env.example .env
   # Edit .env file
   
   # Start with PM2
   pm2 start src/server.js --name "ai-faq-assistant"
   pm2 save
   pm2 startup
   ```

#### AWS ECS/Fargate

```yaml
# task-definition.json
{
  "family": "ai-faq-assistant",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ai-faq-assistant",
      "image": "your-registry/ai-faq-assistant:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ai-faq-assistant",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### App Engine

```yaml
# app.yaml
runtime: nodejs18
service: ai-faq-assistant

env_variables:
  NODE_ENV: production
  PORT: 8080

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

resources:
  cpu: 1
  memory_gb: 2
  disk_size_gb: 10
```

#### Cloud Run

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-faq-assistant
gcloud run deploy ai-faq-assistant \
  --image gcr.io/PROJECT_ID/ai-faq-assistant \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1
```

### Azure

#### Azure App Service

```bash
# Deploy to Azure App Service
az webapp create --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name ai-faq-assistant \
  --runtime "NODE|18-lts"

az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name ai-faq-assistant \
  --settings NODE_ENV=production
```

## 🚀 Production Considerations

### Performance Optimization

1. **Model Caching**
   ```javascript
   // Ensure model is cached
   const modelCacheDir = process.env.MODEL_CACHE_DIR || './models';
   ```

2. **Memory Management**
   ```javascript
   // Monitor memory usage
   setInterval(() => {
     const memUsage = process.memoryUsage();
     console.log('Memory usage:', memUsage);
   }, 300000); // Every 5 minutes
   ```

3. **Connection Pooling**
   ```javascript
   // Use connection pooling for database connections
   const pool = mysql.createPool({
     connectionLimit: 10,
     host: 'localhost',
     user: 'user',
     password: 'password',
     database: 'faq_db'
   });
   ```

### Load Balancing

#### Nginx Configuration

```nginx
# nginx.conf
upstream ai_faq_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://ai_faq_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/TLS Configuration

```nginx
# SSL configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://ai_faq_backend;
        # ... other proxy settings
    }
}
```

## 📊 Monitoring & Logging

### Application Monitoring

#### PM2 Monitoring

```bash
# Monitor application
pm2 monit

# View logs
pm2 logs ai-faq-assistant

# Restart application
pm2 restart ai-faq-assistant

# Scale application
pm2 scale ai-faq-assistant 3
```

#### Health Checks

```bash
# Health check endpoint
curl http://localhost:3000/

# Admin status
curl http://localhost:3000/admin/status
```

### Logging Configuration

```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-faq-assistant' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Metrics Collection

```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
```

## 🔒 Security

### Security Headers

```javascript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limiting

```javascript
// Rate limiting configuration
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### Input Validation

```javascript
// Input validation middleware
const { body, validationResult } = require('express-validator');

const validateQuestion = [
  body('question')
    .isString()
    .trim()
    .isLength({ min: 3, max: 1000 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Model Loading Issues

**Problem**: Model fails to load or download
```bash
# Solution: Clear model cache and retry
rm -rf ./models
npm start
```

#### 2. Memory Issues

**Problem**: Application runs out of memory
```bash
# Solution: Increase Node.js memory limit
node --max-old-space-size=4096 src/server.js
```

#### 3. Port Already in Use

**Problem**: Port 3000 is already occupied
```bash
# Solution: Use different port
PORT=3001 npm start
```

#### 4. QA Engine Not Ready

**Problem**: QA Engine initialization fails
```bash
# Check logs
pm2 logs ai-faq-assistant

# Restart application
pm2 restart ai-faq-assistant
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Enable specific debug categories
DEBUG=app:*,qa:* npm start
```

### Performance Profiling

```bash
# Profile CPU usage
node --prof src/server.js

# Analyze profiling data
node --prof-process isolate-*.log > profile.txt
```

## 📚 Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0 