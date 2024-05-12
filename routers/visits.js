const express = require('express');
const router = express.Router();
const visitsController = require('../controllers/visitData');
const passport = require('passport')
router.get('/getMedicalBill/:visitId', passport.checkAuthentication, visitsController.getMedicalBill)
router.get('/oldMedBill/:patientId', passport.checkAuthentication, visitsController.oldMedBill)
module.exports = router