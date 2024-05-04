const express = require('express');
const router = express.Router();
const visitsController = require('../controllers/visitData');
router.get('/getMedicalBill/:visitId', visitsController.getMedicalBill)
module.exports = router