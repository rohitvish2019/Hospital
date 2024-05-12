const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments')
const passport = require('passport')
router.get('/show/today', passport.checkAuthentication, appointmentsController.showTodaysAppointments);
router.post('/bookToday', passport.checkAuthentication, appointmentsController.addAppointment);
router.get('/show/old', passport.checkAuthentication, appointmentsController.showOld);
router.get('/getByDate', passport.checkAuthentication, appointmentsController.getOldAppointments);
module.exports = router;