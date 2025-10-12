// src/config/firestore.js
const { Firestore } = require('@google-cloud/firestore');
const config = require('./env');
const logger = require('../utils/logger');

let db;

const initializeFirestore = () => {
    try {
        if (config.env === 'production') {
            // In Cloud Run, Firestore client will automatically pick up credentials
            // from the service account attached to the Cloud Run service.
            db = new Firestore({ projectId: config.gcpProjectId });
            logger.info('Firestore initialized for production environment.');
        } else {
            // For local development, use service account key file
            if (!config.googleApplicationCredentials) {
                throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set for local development.');
            }
            db = new Firestore({
                projectId: config.gcpProjectId,
                keyFilename: config.googleApplicationCredentials,
            });
            logger.info('Firestore initialized for local development.');
        }
    } catch (error) {
        logger.error(`Failed to initialize Firestore: ${error.message}`);
        process.exit(1); // Exit if Firestore cannot be initialized
    }
};

const getFirestore = () => {
    if (!db) {
        initializeFirestore(); // Initialize if not already done (should be done once at startup)
    }
    return db;
};

module.exports = {
    initializeFirestore,
    getFirestore,
    FieldValue: Firestore.FieldValue,
};
