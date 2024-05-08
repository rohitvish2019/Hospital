const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchases');
router.get('/home', purchaseController.purchaseHome);
router.post('/save', purchaseController.addPurchases);
router.get('/getMedInfo', purchaseController.getMedInfo);
router.get('/history', purchaseController.purchaseHistoryHome)
router.get('/getHistory', purchaseController.getPurchaseHistory);
router.get('/invetoryManager', purchaseController.invertoryManagerHome);
router.get('/getMedInfo', purchaseController.getMedInfo);
router.get('/getMeds', purchaseController.getMedInfoPrescriptions);
router.post('/updateInventory', purchaseController.updateInventory);
module.exports = router
