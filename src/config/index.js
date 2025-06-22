require('dotenv').config();

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development'
    },

    // AI Model Configuration
    ai: {
        model: process.env.AI_MODEL || 'Xenova/all-MiniLM-L6-v2',
        pooling: 'mean',
        normalize: true
    },

    // Rate Limiting Configuration
    rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        max: parseInt(process.env.RATE_LIMIT_MAX) || 30, // requests per window
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: 60
        }
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    // Data Configuration
    data: {
        qaDataPath: process.env.QA_DATA_PATH || './data/qa_data.json',
        reloadOnStartup: process.env.RELOAD_ON_STARTUP === 'true' || false
    },

    // Security Configuration
    security: {
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"]
                }
            }
        }
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    },

    // Validation Configuration
    validation: {
        question: {
            minLength: 3,
            maxLength: 1000
        }
    }
};

module.exports = config; 