// src/controllers/assessmentController.js
const { getFirestore, FieldValue } = require('../config/firestore');
const { ApiError } = require('../middleware/errorHandler');

const db = getFirestore();

// Create a new assessment for a patient
const createAssessment = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const assessmentData = req.body; // Joi validation ensures this is clean

        // Verify patient exists
        const patientDoc = await db.collection('patients').doc(patientId).get();
        if (!patientDoc.exists) {
            return next(new ApiError(404, 'Patient not found. Cannot create assessment.'));
        }

        assessmentData.patientId = patientId;
        assessmentData.createdAt = FieldValue.serverTimestamp();
        assessmentData.updatedAt = FieldValue.serverTimestamp();

        const assessmentRef = db.collection('assessments').doc();
        await assessmentRef.set(assessmentData);

        res.status(201).json({ id: assessmentRef.id, ...assessmentData });
    } catch (error) {
        next(new ApiError(500, 'Failed to create assessment', false, error.stack));
    }
};

// Get a specific assessment for a patient
const getAssessmentById = async (req, res, next) => {
    try {
        const { patientId, assessmentId } = req.params;
        const assessmentDoc = await db.collection('assessments').doc(assessmentId).get();

        if (!assessmentDoc.exists || assessmentDoc.data().patientId !== patientId) {
            return next(new ApiError(404, 'Assessment not found for this patient.'));
        }

        res.status(200).json({ id: assessmentDoc.id, ...assessmentDoc.data() });
    } catch (error) {
        next(new ApiError(500, 'Failed to fetch assessment', false, error.stack));
    }
};

// Update a specific assessment for a patient
const updateAssessment = async (req, res, next) => {
    try {
        const { patientId, assessmentId } = req.params;
        const updatedData = req.body; // Joi validation ensures this is clean

        const assessmentRef = db.collection('assessments').doc(assessmentId);
        const assessmentDoc = await assessmentRef.get();

        if (!assessmentDoc.exists || assessmentDoc.data().patientId !== patientId) {
            return next(new ApiError(404, 'Assessment not found for this patient.'));
        }

        // Prevent updating patientId or createdAt
        delete updatedData.patientId;
        delete updatedData.createdAt;
        updatedData.updatedAt = db.FieldValue.serverTimestamp();

        await assessmentRef.update(updatedData);

        res.status(200).json({ id: assessmentId, ...updatedData });
    } catch (error) {
        next(new ApiError(500, 'Failed to update assessment', false, error.stack));
    }
};

module.exports = {
    createAssessment,
    getAssessmentById,
    updateAssessment,
};
