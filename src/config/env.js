// src/config/env.js
const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(8080),
    GCP_PROJECT_ID: Joi.string().required(),
    GOOGLE_APPLICATION_CREDENTIALS: Joi.string().when('NODE_ENV', {
        is: 'development',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    CORS_ORIGIN: Joi.string().default('*'), // Be specific in production!
}).unknown(true); // Allow unknown variables

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    gcpProjectId: envVars.GCP_PROJECT_ID,
    googleApplicationCredentials: envVars.GOOGLE_APPLICATION_CREDENTIALS,
    corsOrigin: envVars.CORS_ORIGIN,
};
