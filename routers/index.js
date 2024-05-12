const express = require('express');
const router = express.Router();
router.use('/patients', require('./patients'));
router.use('/appointments', require('./appointments'));
router.use('/visits', require('./visits'))
router.use('/purchases', require('./purchases'));
router.use('/receipts', require('./receipt'))
router.use('/user', require('./user'))
router.get('/',require('../controllers/user').createSession)
module.exports = router;