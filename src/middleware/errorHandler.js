const config = require('../config');

// Error response formatter
const formatError = (error, req) => {
    const errorResponse = {
        error: error.name || 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    };

    // Add stack trace in development
    if (config.server.environment === 'development') {
        errorResponse.stack = error.stack;
    }

    // Add request ID if available
    if (req.id) {
        errorResponse.requestId = req.id;
    }

    return errorResponse;
};

// Error handler middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.message,
            details: error.details || []
        });
    }

    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
    }

    if (error.name === 'ForbiddenError') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Access denied'
        });
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Not Found',
            message: error.message || 'Resource not found'
        });
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    const errorResponse = formatError(error, req);

    res.status(statusCode).json(errorResponse);
};

// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Custom error classes
class ValidationError extends Error {
    constructor(message, details = []) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class UnauthorizedError extends Error {
    constructor(message = 'Authentication required') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(message = 'Access denied') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

module.exports = {
    errorHandler,
    asyncHandler,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
}; 