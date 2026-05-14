/**
 * 💳 Payment Routes with Prisma Database
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

// Validation schemas
const CreatePaymentSchema = z.object({
  amount: z.number().positive().max(1000000),
  memo: z.string().min(1).max(200),
  userId: z.string(),
  buyerUsername: z.string().optional(),
});

const ApprovePaymentSchema = z.object({
  paymentId: z.string(),
});

const CompletePaymentSchema = z.object({
  paymentId: z.string(),
  txid: z.string(),
});

/**
 * POST /api/payments
 * Create new payment
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = CreatePaymentSchema.parse(req.body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { piUid: data.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate Pi payment ID
    const piPaymentId = `pi_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment in DB
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        piPaymentId,
        amount: new Decimal(data.amount),
        memo: data.memo,
        status: 'PENDING',
        buyerUsername: data.buyerUsername,
      },
    });

    console.log('[API] Payment created:', piPaymentId);

    res.status(201).json({
      success: true,
      paymentId: payment.id,
      piPaymentId,
      payment,
    });
  } catch (error: unknown) {
    console.error('[API] Payment creation error:', error);
    const details = error instanceof z.ZodError ? error.errors : undefined;
    res.status(400).json({
      error: 'Invalid payment data',
      details,
    });
  }
});

/**
 * GET /api/payments/:paymentId
 * Get payment details
 */
router.get('/:paymentId', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        qrCode: true,
        user: {
          select: {
            id: true,
            username: true,
            businessName: true,
            piUid: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('[API] Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

/**
 * POST /api/payments/:paymentId/approve
 * Approve payment
 */
router.post('/:paymentId/approve', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
      include: { user: true },
    });

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
router.post('/:paymentId/complete', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const data = CompletePaymentSchema.parse(req.body);

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        txid: data.txid,
        completedAt: new Date(),
      },
      include: { user: true, qrCode: true },
    });

    // Update QR code status
    if (payment.qrCodeId) {
      await prisma.qRCode.update({
        where: { id: payment.qrCodeId },
        data: {
          status: 'COMPLETED',
          completedPaymentId: paymentId,
        },
      });
    }

    // Update analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAnalytics = await prisma.analytics.findFirst({
      where: {
        userId: payment.userId,
        date: today,
      },
    });

    if (existingAnalytics) {
      await prisma.analytics.update({
        where: { id: existingAnalytics.id },
        data: {
          totalPayments: {
            increment: 1,
          },
          totalAmount: {
            increment: payment.amount,
          },
          successRate: 100, // Simplified
        },
      });
    } else {
      await prisma.analytics.create({
        data: {
          userId: payment.userId,
          date: today,
          totalPayments: 1,
          totalAmount: payment.amount,
          uniqueCustomers: 1,
          successRate: 100,
        },
      });
    }

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
 * Get user payments with pagination
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Find user
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get payments
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId: user.id },
        include: { qrCode: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.payment.count({
        where: { userId: user.id },
      }),
    ]);

    res.json({
      userId,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    console.error('[API] Get user payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

/**
 * GET /api/payments/status/:status
 * Get payments by status
 */
router.get('/status/:status', async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const validStatuses = ['PENDING', 'APPROVED', 'COMPLETED', 'FAILED', 'CANCELLED'];

    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payments = await prisma.payment.findMany({
      where: { status: status.toUpperCase() as any },
      include: {
        user: {
          select: { username: true, businessName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({
      status: status.toUpperCase(),
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('[API] Get payments by status error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export default router;
