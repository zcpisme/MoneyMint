const express = require('express');
const router = express.Router();
const portfolioRoutes = require('./routes/portfolioRoutes');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
router.use('/portfolios', portfolioRoutes);
router.use('/auth', authRoutes);
router.use('/trade', tradeRoutes);

module.exports = router;
