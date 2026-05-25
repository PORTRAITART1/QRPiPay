const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
  res.json({
    success: true,
    paymentId: 'payment_123',
    amount: req.body.amount,
    status: 'pending'
  });
});

router.post('/approve', (req, res) => {
  res.json({
    success: true,
    paymentId: req.body.paymentId,
    status: 'approved'
  });
});

router.post('/complete', (req, res) => {
  res.json({
    success: true,
    paymentId: req.body.paymentId,
    status: 'completed'
  });
});

router.get('/history', (req, res) => {
  res.json({
    payments: [
      { id: 'payment_1', amount: 100, status: 'completed', date: new Date() }
    ]
  });
});

module.exports = router;
