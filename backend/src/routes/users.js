const express = require('express');
const router = express.Router();
const piAuth = require('../middleware/piAuth.js');

router.get('/profile', piAuth, (req, res) => {
  try {
    const piAddress = req.piAddress;

    res.json({
      id: piAddress,
      piAddress: piAddress,
      verified: true,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update', piAuth, (req, res) => {
  try {
    const piAddress = req.piAddress;
    const { username, email } = req.body;

    res.json({
      success: true,
      user: {
        piAddress: piAddress,
        username: username,
        email: email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', piAuth, (req, res) => {
  try {
    const piAddress = req.piAddress;

    res.json({
      piAddress: piAddress,
      totalPayments: 42,
      totalAmount: 1500,
      successRate: 98.5
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', piAuth, (req, res) => {
  try {
    res.json({
      users: [
        { id: '1', piAddress: req.piAddress, verified: true }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

