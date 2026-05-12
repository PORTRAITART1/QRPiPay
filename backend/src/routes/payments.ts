/**
 * 💳 Payment Routes - API endpoints
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const CreatePaymentSchema = z.object({
  amount: z.number().positive().max(1000000),
  memo: z.string().min(1).max(200),
  userId: z.string(),
});

const ApprovePaymentSchema = z.object({
  paymentId: z.string(),
});

const CompletePaymentSchema = z.object({
  paymentId: z.string(),
  txid: z.string(),
});

// In-memory store (replace with DB later)
const payments = new Map<
  string,
  {
    id: string;
    userId: string;
    amount: number;
    memo: string;
    status: 'pending' | 'approved' | 'completed' | 'failed';
    createdAt: Date;
    txid?: string;
  }
>();

/**
 * POST /api/payments
 * Create new payment
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const data = CreatePaymentSchema.parse(req.body);

    const paymentId = 'payment_' + Math.random().toString(36).substr(2, 20);

    const payment = {
      id: paymentId,
      userId: data.userId,
      amount: data.amount,
      memo: data.memo,
      status: 'pending' as const,
      createdAt: new Date(),
    };

    payments.set(paymentId, payment);

    console.log('[API] Payment created:', paymentId);

    res.status(201).json({
      success: true,
      paymentId,
      payment,
    });
  } catch (error) {
    console.error('[API] Payment creation error:', error);
    res.status(400).json({
      error: 'Invalid payment data',
      details: error instanceof z.ZodError ? error.errors : undefined,
    });
  }
});

/**
 * GET /api/payments/:paymentId
 * Get payment details
 */
router.get('/:paymentId', (req: Request, res: Response) => {
  const { paymentId } = req.params;

  const payment = payments.get(paymentId);

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  res.json(payment);
});

/**
 * POST /api/payments/:paymentId/approve
 * Approve payment
 */
router.post('/:paymentId/approve', (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = 'approved';

    console.log('[API] Payment approved:', paymentId);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('[API] Approval error:', error);
    res.status(500).json({ error: 'Approval failed' });
  }
});

/**
 * POST /api/payments/:paymentId/complete
 * Complete payment (after blockchain confirmation)
 */
router.post('/:paymentId/complete', (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const data = CompletePaymentSchema.parse(req.body);

    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'approved') {
      return res.status(400).json({
        error: 'Payment must be approved first',
      });
    }

    payment.status = 'completed';
    payment.txid = data.txid;

    console.log('[API] Payment completed:', paymentId, 'TxID:', data.txid);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('[API] Completion error:', error);
    res.status(500).json({ error: 'Completion failed' });
  }
});

/**
 * GET /api/payments/user/:userId
 * Get user payments
 */
router.get('/user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  const userPayments = Array.from(payments.values()).filter(
    (p) => p.userId === userId
  );

  res.json({
    userId,
    count: userPayments.length,
    payments: userPayments,
  });
});

/**
 * GET /api/payments
 * Get all payments (admin)
 */
router.get('/', (req: Request, res: Response) => {
  const allPayments = Array.from(payments.values());

  res.json({
    total: allPayments.length,
    payments: allPayments,
  });
});

export default router;
