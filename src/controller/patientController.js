// src/controllers/patientController.js
const { getFirestore, FieldValue } = require('../config/firestore');
const { ApiError } = require('../middleware/errorHandler');

const db = getFirestore();
console.log(db);
// Create a new patient
const createPatient = async (req, res, next) => {
    const patientData = req.body;
    try {
        // Check if a patient with the same contact number already exists
        const existingPatientSnapshot = await db
            .collection('patients')
            .where('contactNo', '==', patientData.contactNo)
            .limit(1)
            .get();

        if (!existingPatientSnapshot.empty) {
            // A patient with this contact number already exists
            return next(new ApiError(409, 'A patient with this contact number already exists.'));
            // 409 Conflict is the appropriate HTTP status code for duplicate resources
        }

        // No duplicate found, proceed with creating the patient
        patientData.createdAt = FieldValue.serverTimestamp();
        patientData.updatedAt = FieldValue.serverTimestamp();

        const patientRef = db.collection('patients').doc();
        await patientRef.set(patientData);

        res.status(201).json({ id: patientRef.id, ...patientData });
    } catch (error) {
        next(new ApiError(500, 'Failed to create patient', false, error.stack));
    }
};


// Get all patients or search by name
const getPatients = async (req, res, next) => {
    try {
        const { searchTerm } = req.query;

        console.log(searchTerm, !searchTerm || searchTerm.trim() === '');
        if (!searchTerm || searchTerm.trim() === '') {
            // No search term provided, return all patients (or implement pagination for large datasets)
            const snapshot = await db.collection('patients').get();
            const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(patients);
        }

        // Execute searches in parallel for efficiency
        const [nameResults, contactResults] = await Promise.all([
            searchByName(searchTerm),
            searchByContact(searchTerm),
        ]);

        // Merge results and remove duplicates (based on patient ID)
        const mergedPatients = mergePatientResults(nameResults, contactResults);

        res.status(200).json(mergedPatients);
    } catch (error) {
        next(new ApiError(500, 'Failed to fetch patients', false, error.stack));
    }
};

// Get a single patient by ID
const getPatientById = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const patientDoc = await db.collection('patients').doc(patientId).get();

        if (!patientDoc.exists) {
            return next(new ApiError(404, 'Patient not found.'));
        }

        res.status(200).json({ id: patientDoc.id, ...patientDoc.data() });
    } catch (error) {
        next(new ApiError(500, 'Failed to fetch patient', false, error.stack));
    }
};

const searchByName = async (searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const snapshot = await db
        .collection('patients')
        .where('name', '>=', lowerSearchTerm)
        .where('name', '<=', lowerSearchTerm + '\uf8ff')
        .orderBy('name')
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const searchByContact = async (searchTerm) => {
    // For phone numbers, we can do both exact match and starts-with
    // Remove any non-numeric characters for flexible searching
    const numericSearch = searchTerm.replace(/\D/g, '');

    if (numericSearch === '') {
        // If no numeric characters, skip contact search
        return [];
    }

    // Starts-with search for contact number
    const snapshot = await db
        .collection('patients')
        .where('contactNo', '>=', numericSearch)
        .where('contactNo', '<=', numericSearch + '\uf8ff')
        .orderBy('contactNo')
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function: Merge and deduplicate patient results
const mergePatientResults = (nameResults, contactResults) => {
    const patientMap = new Map();

    // Add all name results
    nameResults.forEach(patient => {
        patientMap.set(patient.id, patient);
    });

    // Add contact results (will automatically deduplicate based on ID)
    contactResults.forEach(patient => {
        patientMap.set(patient.id, patient);
    });

    // Convert map back to array
    return Array.from(patientMap.values());
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
};
