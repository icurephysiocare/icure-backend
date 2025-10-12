// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const config = require('../config/env');

// Custom error class for API errors
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // If it's not an operational error, hide internal details in production
    if (!err.isOperational && process.env.NODE_ENV === 'production') {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.locals.errorMessage = err.message; // For logging

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack in dev
    };

    logger.error(err); // Log the full error

    res.status(statusCode).send(response);
};

module.exports = {
    ApiError,
    errorHandler,
};
