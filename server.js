// src/server.js
const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const { initializeFirestore } = require('./src/config/firestore');

// Initialize Firestore connection
initializeFirestore();

// Start the server
const server = app.listen(config.port, () => {
    logger.info(`Physio Backend Service listening on port ${config.port} in ${config.env} mode.`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
