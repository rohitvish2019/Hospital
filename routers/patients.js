const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients')
router.get('/newVisit', patientsController.newVisit);
module.exports = router;