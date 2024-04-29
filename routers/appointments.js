const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments')
router.get('/show/today', appointmentsController.showTodaysAppointments);
router.post('/bookToday', appointmentsController.addAppointment);
module.exports = router;