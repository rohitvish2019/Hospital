const express = require('express');
const router = express.Router();
const receiptsController = require('../controllers/receipts');
router.get('/home', receiptsController.receiptHome)
module.exports = router