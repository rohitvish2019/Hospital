const express = require('express');
const router = express.Router();
const passport = require('passport')
const purchaseController = require('../controllers/purchases');
router.get('/home', passport.checkAuthentication, purchaseController.purchaseHome);
router.post('/save', passport.checkAuthentication, purchaseController.addPurchases);
router.get('/getMedInfo', passport.checkAuthentication, purchaseController.getMedInfo);
router.get('/history', passport.checkAuthentication, purchaseController.purchaseHistoryHome);
router.get('/returnHistory/home', passport.checkAuthentication, purchaseController.returnsHome);
router.get('/getHistory', passport.checkAuthentication, purchaseController.getPurchaseHistory);
router.get('/getInventories', passport.checkAuthentication, purchaseController.getActiveInventories)
router.get('/invetoryManager', passport.checkAuthentication, purchaseController.invertoryManagerHome);
router.get('/inventories/all', passport.checkAuthentication, purchaseController.allInventoriesHome);
router.get('/getMeds', passport.checkAuthentication, purchaseController.getMedInfoPrescriptions);
router.post('/updateInventory', passport.checkAuthentication, purchaseController.updateInventory);
router.post('/return', passport.checkAuthentication, purchaseController.returnPurchases);
router.get('/getReturnsHistory', passport.checkAuthentication, purchaseController.getReturnsHistory)
module.exports = router
