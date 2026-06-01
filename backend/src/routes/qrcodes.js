  GNU nano 8.7                       qrcodes.js
const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  res.json({
    success: true,
    qrCodeId: 'qr_123',
    data: req.body.data,
    url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=test'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    qrCodeId: req.params.id,
    data: 'QR Code Data',
    createdAt: new Date()
  });
});

router.get('/', (req, res) => {
  res.json({
    qrcodes: [
      { id: 'qr_1', data: 'data1', createdAt: new Date() }
    ]
  });
});

module.exports = router;



