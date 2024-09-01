const express = require('express');
const router = express.Router();
const genAIController = require('../controllers/ai-integration');
router.get('/home', genAIController.GenAIHome);
module.exports = router