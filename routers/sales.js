const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales');
const passport = require('passport')
router.get('/History/home', passport.checkAuthentication, salesController.salesHistoryHome);
router.get('/getHistoryByDate', passport.checkAuthentication, salesController.getSalesHistoryDate);
router.get('/getHistoryByRange', passport.checkAuthentication, salesController.getSalesHistoryRange)
module.exports = router