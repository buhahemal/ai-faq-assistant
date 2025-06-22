const express = require('express');
const AdminController = require('../controllers/adminController');

const router = express.Router();

// Create a function to initialize routes with QA engine
const createAdminRoutes = (qaEngine) => {
    const adminController = new AdminController(qaEngine);

    // Admin endpoints
    router.post('/reload-data', adminController.reloadQAData);
    router.post('/save-data', adminController.saveQAData);
    router.get('/status', adminController.getSystemStatus);

    return router;
};

module.exports = { router, createAdminRoutes }; 