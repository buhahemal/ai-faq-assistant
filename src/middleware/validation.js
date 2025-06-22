const { body, validationResult, query, param } = require('express-validator');
const config = require('../config');
const { ValidationError } = require('./errorHandler');

// Validation rules
const validationRules = {
    question: [
        body('question')
            .isString()
            .trim()
            .isLength({ 
                min: config.validation.question.minLength, 
                max: config.validation.question.maxLength 
            })
            .withMessage(`Question must be a string between ${config.validation.question.minLength} and ${config.validation.question.maxLength} characters`)
    ],

    tags: [
        query('tags')
            .isArray()
            .withMessage('Tags must be an array')
            .optional()
    ],

    qaId: [
        param('id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('QA ID is required')
    ],

    category: [
        param('category')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('Category is required')
    ]
};

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new ValidationError(
            'Validation failed',
            errors.array()
        );
        return next(validationError);
    }
    next();
};

// Combined validation middleware
const validateQuestion = [...validationRules.question, validate];
const validateTags = [...validationRules.tags, validate];
const validateQaId = [...validationRules.qaId, validate];
const validateCategory = [...validationRules.category, validate];

module.exports = {
    validate,
    validateQuestion,
    validateTags,
    validateQaId,
    validateCategory,
    validationRules
}; 