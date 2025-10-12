// src/routes/index.js
const express = require('express');
const patientRoutes = require('./patientRoutes');
const assessmentRoutes = require('./assessmentRoutes');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
    res.status(200).send('Physio Backend Service is running and healthy!');
});

router.use('/patients', patientRoutes);
router.use('/patients', assessmentRoutes); // Assessments are nested under patients

module.exports = router;
