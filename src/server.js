const config = require('./config');
const App = require('./app');
const QAEngine = require('./services/QAEngine');

class Server {
    constructor() {
        this.app = new App();
        this.qaEngine = new QAEngine();
        this.server = null;
    }

    async initialize() {
        try {
            console.log('🚀 Starting AI FAQ Assistant...');
            
            // Initialize QA Engine
            await this.qaEngine.initialize();
            
            // Set QA Engine in app
            this.app.setQAEngine(this.qaEngine);
            
            console.log('✅ QA Engine initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize QA Engine:', error);
            throw error;
        }
    }

    start() {
        const app = this.app.getApp();
        const PORT = config.server.port;
        const HOST = config.server.host;

        this.server = app.listen(PORT, HOST, () => {
            console.log(`🚀 AI FAQ Assistant is running on http://${HOST}:${PORT}`);
            console.log(`📊 Health check: http://${HOST}:${PORT}/`);
            console.log(`🔍 Support endpoint: http://${HOST}:${PORT}/support/query`);
            console.log(`📈 Statistics: http://${HOST}:${PORT}/support/stats`);
            console.log(`⚙️  Admin status: http://${HOST}:${PORT}/admin/status`);
            console.log(`🌍 Environment: ${config.server.environment}`);
        });

        // Handle server errors
        this.server.on('error', (error) => {
            console.error('❌ Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
            }
        });

        return this.server;
    }

    stop() {
        if (this.server) {
            console.log('🛑 Shutting down server...');
            this.server.close(() => {
                console.log('✅ Server stopped gracefully');
                process.exit(0);
            });
        }
    }

    getStats() {
        return {
            qaEngineReady: this.qaEngine.isReady(),
            stats: this.qaEngine.isReady() ? this.qaEngine.getStats() : null,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: config.server.environment
        };
    }
}

// Handle graceful shutdown
const server = new Server();

process.on('SIGTERM', () => {
    console.log('📨 SIGTERM received, shutting down gracefully...');
    server.stop();
});

process.on('SIGINT', () => {
    console.log('📨 SIGINT received, shutting down gracefully...');
    server.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    server.stop();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    server.stop();
});

// Start the server
async function startServer() {
    try {
        await server.initialize();
        server.start();
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Export for testing
module.exports = { Server, startServer };

// Start server if this file is run directly
if (require.main === module) {
    startServer();
} 