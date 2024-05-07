const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients')
router.get('/newVisit/:id', patientsController.newVisit);
router.get('/new', patientsController.patientRegistration);
router.post('/register', patientsController.addNewPatient);
router.post('/add/Examinations/:patientId', patientsController.addExaminations);
router.post('/add/Tests/:patientId', patientsController.addTests);
router.post('/add/Complaint/:patientId', patientsController.addComplaint)
router.get('/get/:PatientId',patientsController.getPatientById);
router.get('/getSavedData', patientsController.getSavedData);
router.get('/getPrescriptionForm/:patientId', patientsController.getPriscriptionForm);
router.get('/medications/:patientId',patientsController.medicationsPage)
router.post('/add/Prescriptions/:patientId', patientsController.savePrescriptions);
router.get('/getPrescriptions', patientsController.getPrescriptions);
router.get('/getOldPrescription/:patientId', patientsController.getOldPrescriptionForm);
module.exports = router;