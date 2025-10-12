// src/routes/patientRoutes.js
const express = require('express');
const patientController = require('../controller/patientController');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validation');
const { patientSchemas } = require('./validation/validationSchemas');

const router = express.Router();

router.post(
    '/',
    validate(patientSchemas.createPatient),
    asyncHandler(patientController.createPatient)
);
router.get(
    '/',
    validate(patientSchemas.getPatients), // Validate query params
    asyncHandler(patientController.getPatients)
);
router.get(
    '/:patientId',
    asyncHandler(patientController.getPatientById)
);

module.exports = router;
