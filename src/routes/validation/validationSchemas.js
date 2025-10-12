// src/routes/validationSchemas.js
const Joi = require('joi');

const patientSchemas = {
    createPatient: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        date: Joi.date().iso().required(), // ISO format for date
        age: Joi.number().min(0).max(120).allow(null),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        contactNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
        referredBy: Joi.string().max(100).optional().allow(''),
        address: Joi.string().max(255).optional().allow(''),
        occupation: Joi.string().max(100).optional().allow(''),
    }),
    getPatients: Joi.object({
        searchTerm: Joi.string().max(100).optional().allow(''),
    }),
};

const assessmentSchemas = {
    createAssessment: Joi.object({
        // Chief Complaint Section
        chiefComplaintOnset: Joi.string().max(200).required(),
        chiefComplaintWorse: Joi.string().max(200).required(),
        chiefComplaintBetter: Joi.string().max(200).required(),
        chiefComplaintTreatment: Joi.string().max(200).required(),
        chiefComplaintDescription: Joi.string().max(500).required(),

        // Pain Evaluation Section
        painOnset: Joi.string().max(100).optional().allow(''),
        painDuration: Joi.string().max(100).optional().allow(''),
        painLocation: Joi.string().max(200).optional().allow(''),
        painType: Joi.string().max(100).optional().allow(''),
        aggravatingFactors: Joi.string().max(200).optional().allow(''),
        relievingFactors: Joi.string().max(200).optional().allow(''),
        painScale: Joi.number().min(0).max(10).required(),
        painFrequency: Joi.string().max(100).optional().allow(''),
        painRadiation: Joi.string().max(200).optional().allow(''),
        painTiming: Joi.string().max(100).optional().allow(''),
        functionalLimitation: Joi.string().max(300).optional().allow(''),

        // Palpation
        palpationFindings: Joi.string().max(500).optional().allow(''),

        // Associated Problems
        associatedProblems: Joi.string().max(500).optional().allow(''),

        // Muscular Evaluation
        muscularEvaluation: Joi.string().max(1000).optional().allow(''),

        // Joint Evaluation
        jointEvaluation: Joi.string().max(1000).optional().allow(''),

        // Posture Evaluation
        postureFindings: Joi.string().max(500).optional().allow(''),

        // Gait Evaluation
        gaitAnalysis: Joi.string().max(500).optional().allow(''),

        // Special Tests
        specialTests: Joi.string().max(500).optional().allow(''),

        // Diagnosis
        diagnosis: Joi.string().max(500).required(),

        // Treatment Plan
        shortTermGoals: Joi.string().max(500).optional().allow(''),
        longTermGoals: Joi.string().max(500).optional().allow(''),
        interventions: Joi.string().max(1000).optional().allow(''),
    }),
    updateAssessment: Joi.object({
        // All fields are optional for update, but retain validation if present
        chiefComplaintOnset: Joi.string().max(200).optional(),
        chiefComplaintWorse: Joi.string().max(200).optional(),
        chiefComplaintBetter: Joi.string().max(200).optional(),
        chiefComplaintTreatment: Joi.string().max(200).optional(),
        chiefComplaintDescription: Joi.string().max(500).optional(),

        painOnset: Joi.string().max(100).optional().allow(''),
        painDuration: Joi.string().max(100).optional().allow(''),
        painLocation: Joi.string().max(200).optional().allow(''),
        painType: Joi.string().max(100).optional().allow(''),
        aggravatingFactors: Joi.string().max(200).optional().allow(''),
        relievingFactors: Joi.string().max(200).optional().allow(''),
        painScale: Joi.number().min(0).max(10).optional(),
        painFrequency: Joi.string().max(100).optional().allow(''),
        painRadiation: Joi.string().max(200).optional().allow(''),
        painTiming: Joi.string().max(100).optional().allow(''),
        functionalLimitation: Joi.string().max(300).optional().allow(''),

        palpationFindings: Joi.string().max(500).optional().allow(''),
        associatedProblems: Joi.string().max(500).optional().allow(''),
        muscularEvaluation: Joi.string().max(1000).optional().allow(''),
        jointEvaluation: Joi.string().max(1000).optional().allow(''),
        postureFindings: Joi.string().max(500).optional().allow(''),
        gaitAnalysis: Joi.string().max(500).optional().allow(''),
        specialTests: Joi.string().max(500).optional().allow(''),
        diagnosis: Joi.string().max(500).optional(),
        shortTermGoals: Joi.string().max(500).optional().allow(''),
        longTermGoals: Joi.string().max(500).optional().allow(''),
        interventions: Joi.string().max(1000).optional().allow(''),
    }),
};

module.exports = {
    patientSchemas,
    assessmentSchemas,
};
