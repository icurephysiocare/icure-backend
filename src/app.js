// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Good security practice
const xss = require('xss-clean'); // Good security practice
const mongoSanitize = require('express-mongo-sanitize'); // Good for MongoDB, less critical for Firestore but good habit
const compression = require('compression'); // For GZIP compression
const httpStatus = require('http-status'); // For standard HTTP status codes
const config = require('./config/env');
const { ApiError, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes'); // Main router
const logger = require('./utils/logger');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize()); // Though Firestore, good to have for general NoSQL input

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Include PATCH if you plan to use it
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API routes
app.use('/api/v1', routes); // Prefix all API routes with /api/v1

// Send back a 404 error for any unknown API request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// Handle errors
app.use(errorHandler);

module.exports = app;
