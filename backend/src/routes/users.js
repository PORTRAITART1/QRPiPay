const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({
    id: '1',
    username: 'user',
    email: 'user@example.com',
    piAddress: 'pi_user123',
    createdAt: new Date()
  });
});

router.post('/update', (req, res) => {
  res.json({
    success: true,
    user: req.body
  });
});

router.get('/stats', (req, res) => {
  res.json({
    totalPayments: 42,
    totalAmount: 1500,
    successRate: 98.5
  });
});

router.get('/', (req, res) => {
  res.json({
    users: [
      { id: '1', username: 'user1', email: 'user1@example.com' }
    ]
  });
});

module.exports = router;
