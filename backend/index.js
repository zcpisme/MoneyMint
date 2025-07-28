const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

router.use('/auth', authRoutes);
router.use('/trade', tradeRoutes);

module.exports = router;
