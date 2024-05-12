const express = require('express');
const router = express.Router();
const passport = require('passport')
const purchaseController = require('../controllers/purchases');
router.get('/home', passport.checkAuthentication, purchaseController.purchaseHome);
router.post('/save', passport.checkAuthentication, purchaseController.addPurchases);
router.get('/getMedInfo', passport.checkAuthentication, purchaseController.getMedInfo);
router.get('/history', passport.checkAuthentication, purchaseController.purchaseHistoryHome)
router.get('/getHistory', passport.checkAuthentication, purchaseController.getPurchaseHistory);
router.get('/invetoryManager', passport.checkAuthentication, purchaseController.invertoryManagerHome);
router.get('/getMeds', passport.checkAuthentication, purchaseController.getMedInfoPrescriptions);
router.post('/updateInventory', passport.checkAuthentication, purchaseController.updateInventory);
module.exports = router
