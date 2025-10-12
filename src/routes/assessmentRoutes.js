// src/routes/assessmentRoutes.js
const express = require('express');
const assessmentController = require('../controller/assessmentController');
const asyncHandler = require('..//utils/asyncHandler');
const validate = require('../middleware/validation');
const { assessmentSchemas } = require('./validation/validationSchemas');

const router = express.Router();

router.post(
    '/:patientId/assessments',
    validate(assessmentSchemas.createAssessment),
    asyncHandler(assessmentController.createAssessment)
);
router.get(
    '/:patientId/assessments/:assessmentId',
    asyncHandler(assessmentController.getAssessmentById)
);
router.put(
    '/:patientId/assessments/:assessmentId',
    validate(assessmentSchemas.updateAssessment),
    asyncHandler(assessmentController.updateAssessment)
);

module.exports = router;
