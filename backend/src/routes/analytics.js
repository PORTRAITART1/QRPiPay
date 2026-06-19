const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service.js');
const { verifyToken } = require('../middleware/auth.js');

// Get dashboard stats
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getDashboardStats(userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get payment trends
router.get('/trends', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;
    const result = await analyticsService.getPaymentTrends(userId, days);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

module.exports = router;
