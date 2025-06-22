const express = require('express');
const { validateQuestion, validateTags, validateQaId, validateCategory } = require('../middleware/validation');
const SupportController = require('../controllers/supportController');

const router = express.Router();

// Create a function to initialize routes with QA engine
const createSupportRoutes = (qaEngine) => {
    const supportController = new SupportController(qaEngine);

    // Health check
    router.get('/', supportController.getHealth);

    // Support query endpoints
    router.post('/query', validateQuestion, supportController.submitQuery);
    router.post('/query/all-answers', validateQuestion, supportController.submitQueryWithAllAnswers);

    // QA pairs endpoints
    router.get('/qa-pairs', supportController.getAllQAPairs);
    router.get('/qa-pairs/:id', validateQaId, supportController.getQAPairById);

    // Search endpoints
    router.get('/search/category/:category', validateCategory, supportController.searchByCategory);
    router.get('/search/tags', validateTags, supportController.searchByTags);

    // Metadata endpoints
    router.get('/categories', supportController.getCategories);
    router.get('/tags', supportController.getTags);
    router.get('/stats', supportController.getStats);

    return router;
};

module.exports = { router, createSupportRoutes }; 