const express = require('express');
const router = express.Router();
const passport = require('passport')
const patientsController = require('../controllers/patients')
router.get('/newVisit/:id', passport.checkAuthentication,  patientsController.newVisit);
router.get('/history/:id', passport.checkAuthentication, patientsController.patientHistoryHome);
router.get('/new', passport.checkAuthentication, patientsController.patientRegistration);
router.get('/IPD/new', passport.checkAuthentication, patientsController.IPDpatientRegistration);
router.post('/register', passport.checkAuthentication, patientsController.addNewPatient);
router.post('/add/Examinations/:patientId', passport.checkAuthentication, patientsController.addExaminations);
router.post('/add/Tests/:patientId', passport.checkAuthentication, patientsController.addTests);
router.post('/add/Complaint/:patientId', passport.checkAuthentication, patientsController.addComplaint)
router.get('/get/:PatientId',passport.checkAuthentication, patientsController.getPatientById);
router.get('/getSavedData', passport.checkAuthentication, patientsController.getSavedData);
router.get('/getPrescriptionForm/:patientId', passport.checkAuthentication, patientsController.getPriscriptionForm);
router.get('/medications/:patientId',passport.checkAuthentication, patientsController.medicationsPage)
router.post('/add/Prescriptions/:patientId', passport.checkAuthentication, patientsController.savePrescriptions);
router.get('/getPrescriptions', passport.checkAuthentication, patientsController.getPrescriptions);
router.get('/getOldPrescription/:patientId', passport.checkAuthentication, patientsController.getOldPrescriptionForm);
router.get('/getHistory/:id', passport.checkAuthentication, patientsController.getPatientHistory)
router.get('/receipt/:id', passport.checkAuthentication, patientsController.getRegistrationReceipt)
router.post('/admit', passport.checkAuthentication, patientsController.admitPatient);
router.get('/admitted/active', passport.checkAuthentication, patientsController.showAdmitted);
router.post('/save/admissionData', passport.checkAuthentication, patientsController.saveOperationsData);
router.post('/discharge', passport.checkAuthentication, patientsController.dischargePatient)
router.get('/dischargeSheet/:id', passport.checkAuthentication, patientsController.dischargeSheet)
module.exports = router;