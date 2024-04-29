const express = require('express');
const router = express.Router();
router.use('/patients', require('./patients'));
router.use('/appointments', require('./appointments'));
module.exports = router;