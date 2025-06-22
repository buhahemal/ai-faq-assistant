const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

class App {
    constructor() {
        this.app = express();
        this.qaEngine = null;
        this.setupMiddleware();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet(config.security.helmet));
        
        // CORS middleware
        this.app.use(cors(config.cors));
        
        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Rate limiting
        const limiter = rateLimit(config.rateLimit);
        this.app.use(limiter);
        
        // Request logging (basic)
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // Health check route
        this.app.get('/', (req, res) => {
            res.json({
                status: 'healthy',
                service: 'AI FAQ Assistant',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                qaEngineReady: this.qaEngine ? this.qaEngine.isReady() : false
            });
        });

        // API routes
        const { createSupportRoutes } = require('./routes/supportRoutes');
        const { createAdminRoutes } = require('./routes/adminRoutes');
        
        this.app.use('/support', createSupportRoutes(this.qaEngine));
        this.app.use('/admin', createAdminRoutes(this.qaEngine));

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Not found',
                message: 'The requested endpoint does not exist.',
                available_endpoints: {
                    'GET /': 'Health check',
                    'POST /support/query': 'Submit a support question (primary answer)',
                    'POST /support/query/all-answers': 'Submit a support question (all answers)',
                    'GET /support/qa-pairs': 'Get all QA pairs',
                    'GET /support/qa-pairs/:id': 'Get QA pair by ID',
                    'GET /support/search/category/:category': 'Search by category',
                    'GET /support/search/tags': 'Search by tags',
                    'GET /support/categories': 'Get all categories',
                    'GET /support/tags': 'Get all tags',
                    'GET /support/stats': 'Get statistics',
                    'POST /admin/reload-data': 'Reload QA data (admin)',
                    'POST /admin/save-data': 'Save QA data (admin)',
                    'GET /admin/status': 'Get system status (admin)'
                }
            });
        });
    }

    setupErrorHandling() {
        // Global error handler
        this.app.use(errorHandler);
    }

    setQAEngine(qaEngine) {
        this.qaEngine = qaEngine;
        this.setupRoutes();
    }

    getApp() {
        return this.app;
    }
}

module.exports = App; 