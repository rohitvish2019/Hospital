const express = require('express');
const router = express.Router();
const receiptsController = require('../controllers/receipts');
router.get('/home', receiptsController.receiptHome);
router.post('/save', receiptsController.addNewReceipt);
router.get('/gerenate/:id', receiptsController.getReceipt)
module.exports = router