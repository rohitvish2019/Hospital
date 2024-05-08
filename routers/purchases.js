const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchases');
router.get('/home', purchaseController.purchaseHome);
router.post('/save', purchaseController.addPurchases);
router.get('/getMedInfo', purchaseController.getMedInfo);
router.get('/history', purchaseController.purchaseHistoryHome)
router.get('/getHistory', purchaseController.getPurchaseHistory)
module.exports = router