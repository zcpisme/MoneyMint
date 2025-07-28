const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

router.post('/buy', tradeController.buyStock);
router.post('/sell', tradeController.sellStock);

module.exports = router;
