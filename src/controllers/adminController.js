const QAEngine = require('../services/QAEngine');
const { asyncHandler } = require('../middleware/errorHandler');

class AdminController {
    constructor(qaEngine) {
        this.qaEngine = qaEngine;
    }

    // Reload QA data
    reloadQAData = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        await this.qaEngine.reloadQAData();
        
        res.json({
            message: 'QA data reloaded successfully',
            stats: this.qaEngine.getStats()
        });
    });

    // Save QA data
    saveQAData = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        await this.qaEngine.saveQAData();
        
        res.json({
            message: 'QA data saved successfully',
            stats: this.qaEngine.getStats()
        });
    });

    // Get system status
    getSystemStatus = asyncHandler(async (req, res) => {
        const status = {
            qaEngineReady: this.qaEngine.isReady(),
            stats: this.qaEngine.isReady() ? this.qaEngine.getStats() : null,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        };

        res.json(status);
    });
}

module.exports = AdminController; 