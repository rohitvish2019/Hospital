const express = require('express');
const router = express.Router();
const receiptsController = require('../controllers/receipts');
const passport = require('passport')
router.get('/home', passport.checkAuthentication, receiptsController.receiptHome);
router.post('/save', passport.checkAuthentication, receiptsController.addNewReceipt);
router.get('/gerenate/:id', passport.checkAuthentication, receiptsController.getReceipt)
module.exports = router