const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients')
router.get('/newVisit/:id', patientsController.newVisit);
router.get('/new', patientsController.patientRegistration);
router.post('/register', patientsController.addNewPatient);
router.post('/add/Examinations/:patientId', patientsController.addExaminations);
router.post('/add/Tests/:patientId', patientsController.addTests);
router.get('/get/:PatientId',patientsController.getPatientById);
router.get('/getSavedData', patientsController.getSavedData);
router.get('/getPrescriptionForm/:patientId', patientsController.getPriscriptionForm);
module.exports = router;