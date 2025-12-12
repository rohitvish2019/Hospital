const express = require('express');
const router = express.Router();
const receiptsController = require('../controllers/receipts');
const passport = require('passport')
router.get('/home', passport.checkAuthentication, receiptsController.receiptHome);
router.post('/save', passport.checkAuthentication, receiptsController.addNewReceipt);
router.get('/gerenate/:id', passport.checkAuthentication, receiptsController.getReceipt);
router.get('/extMedBill/:id', receiptsController.getExtMedBill)
router.get('/find', receiptsController.finReceiptHome);
router.get('/findById', receiptsController.findReceiptById);
router.get('/findByName', receiptsController.findReceiptByName);
router.get('/newMedBill', receiptsController.newMedSales);
router.post('/medbill/ext', receiptsController.addMedBill);
router.get('/getMedsListLink', receiptsController.getMedsByLink);
router.get('/cm_letter', receiptsController.getCMLetter);
router.get('/cm_letterv2', receiptsController.getCMV2);
router.get('/cm_letterv3', receiptsController.getCMV3);
router.get('/cm_letterv4', receiptsController.getCMV4);
module.exports = router