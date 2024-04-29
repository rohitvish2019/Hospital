const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients')
router.get('/newVisit/:id', patientsController.newVisit);
router.get('/new', patientsController.patientRegistration);
router.post('/register', patientsController.addNewPatient);
router.post('/add/Examinations/:patientId', patientsController.addExaminations);
router.get('/get/:PatientId',patientsController.getPatientById);
module.exports = router;