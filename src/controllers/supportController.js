const QAEngine = require('../services/QAEngine');
const { asyncHandler, NotFoundError } = require('../middleware/errorHandler');

class SupportController {
    constructor(qaEngine) {
        this.qaEngine = qaEngine;
    }

    // Health check
    getHealth = asyncHandler(async (req, res) => {
        res.json({
            status: 'healthy',
            service: 'AI FAQ Assistant',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            qaEngineReady: this.qaEngine.isReady(),
            stats: this.qaEngine.isReady() ? this.qaEngine.getStats() : null
        });
    });

    // Submit support query (primary answer)
    submitQuery = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing. Please try again in a few moments.');
        }

        const { question } = req.body;
        const match = await this.qaEngine.findBestMatch(question);

        if (!match) {
            throw new NotFoundError('We could not find a relevant answer to your question.');
        }

        res.json({
            id: match.id,
            match_question: match.question,
            answer: match.answer,
            answer_id: match.answer_id,
            confidence: Math.round(match.confidence * 100) / 100,
            user_question: question,
            category: match.category,
            tags: match.tags,
            total_answers_available: match.all_answers.length
        });
    });

    // Submit support query with all answers
    submitQueryWithAllAnswers = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing. Please try again in a few moments.');
        }

        const { question } = req.body;
        const match = await this.qaEngine.findBestMatchWithAllAnswers(question);

        if (!match) {
            throw new NotFoundError('We could not find a relevant answer to your question.');
        }

        res.json({
            id: match.id,
            match_question: match.question,
            answers: match.answers,
            confidence: Math.round(match.confidence * 100) / 100,
            user_question: question,
            category: match.category,
            tags: match.tags
        });
    });

    // Get all QA pairs
    getAllQAPairs = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        res.json({
            qa_pairs: this.qaEngine.getQAPairs(),
            stats: this.qaEngine.getStats()
        });
    });

    // Get QA pair by ID
    getQAPairById = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        const qaPair = this.qaEngine.getQAPairById(req.params.id);
        
        if (!qaPair) {
            throw new NotFoundError('The requested QA pair does not exist.');
        }

        res.json({
            qa_pair: qaPair
        });
    });

    // Search by category
    searchByCategory = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        const category = req.params.category;
        const qaPairs = await this.qaEngine.searchByCategory(category);

        res.json({
            category: category,
            qa_pairs: qaPairs,
            count: qaPairs.length
        });
    });

    // Search by tags
    searchByTags = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        const tags = req.query.tags;
        const qaPairs = await this.qaEngine.searchByTags(tags);

        res.json({
            tags: tags,
            qa_pairs: qaPairs,
            count: qaPairs.length
        });
    });

    // Get categories
    getCategories = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        res.json({
            categories: this.qaEngine.getCategories()
        });
    });

    // Get tags
    getTags = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        res.json({
            tags: this.qaEngine.getTags()
        });
    });

    // Get statistics
    getStats = asyncHandler(async (req, res) => {
        if (!this.qaEngine.isReady()) {
            throw new Error('QA Engine is still initializing.');
        }

        res.json({
            stats: this.qaEngine.getStats()
        });
    });
}

module.exports = SupportController; 