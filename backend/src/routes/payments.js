const express = require('express');
const router = express.Router();
const piPaymentsService = require('../services/piPayments.service.js');
const { verifyToken } = require('../middleware/auth.js');

// Create payment
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await piPaymentsService.createPayment(
      userId,
      amount,
      description
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Get payment status
router.get('/:paymentId', verifyToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await piPaymentsService.getPaymentStatus(paymentId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payment' });
  }
});

// Complete payment
router.post('/:paymentId/complete', verifyToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { txHash } = req.body;

    if (!txHash) {
      return res.status(400).json({ error: 'txHash required' });
    }

    const result = await piPaymentsService.completePayment(paymentId, txHash);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete payment' });
  }
});

// Get payment history
router.get('/history/all', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await prisma.payment.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      payments: payments
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
