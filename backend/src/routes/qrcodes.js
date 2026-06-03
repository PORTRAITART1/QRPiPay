const express = require('express');
const router = express.Router();
const piAuth = require('../middleware/piAuth.js');

router.post('/generate', piAuth, (req, res) => {
  try {
    const { amount, description } = req.body;
    const piAddress = req.piAddress;

    const qrCodeData = {
      piAddress: piAddress,
      amount: amount,
      description: description,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      qrCodeId: 'qr_' + Date.now(),
      data: JSON.stringify(qrCodeData),
      url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrCodeData))}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', piAuth, (req, res) => {
  try {
    res.json({
      qrCodeId: req.params.id,
      piAddress: req.piAddress,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', piAuth, (req, res) => {
  try {
    res.json({
      piAddress: req.piAddress,
      qrcodes: [
        { id: 'qr_1', createdAt: new Date() }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
