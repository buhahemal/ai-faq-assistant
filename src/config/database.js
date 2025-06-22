const config = require('./index');

const databaseConfig = {
    // For future database integration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-faq-assistant',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },

    // Redis configuration for caching
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || null,
        db: process.env.REDIS_DB || 0,
        keyPrefix: 'ai-faq:'
    },

    // File-based storage (current implementation)
    fileStorage: {
        qaDataPath: config.data.qaDataPath,
        backupPath: './data/backups/',
        maxBackups: 10
    }
};

module.exports = databaseConfig; 