const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments')
router.get('/show/today', appointmentsController.showTodaysAppointments);
router.post('/bookToday', appointmentsController.addAppointment);
router.get('/show/old', appointmentsController.showOld);
router.get('/getByDate',appointmentsController.getOldAppointments);
module.exports = router;