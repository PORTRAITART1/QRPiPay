/**
 * 📊 Analytics Routes
 */

import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/analytics/user/:userId
 * Get user analytics for date range
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    // Find user
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get analytics
    const analytics = await prisma.analytics.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate totals
    const totals = {
      totalPayments: analytics.reduce((sum, a) => sum + a.totalPayments, 0),
      totalAmount: analytics.reduce((sum, a) => sum + a.totalAmount.toNumber(), 0),
      uniqueCustomers: analytics.reduce((sum, a) => sum + a.uniqueCustomers, 0),
      avgPaymentValue: 0,
    };

    if (totals.totalPayments > 0) {
      totals.avgPaymentValue = totals.totalAmount / totals.totalPayments;
    }

    res.json({
      userId,
      period: `${days} days`,
      totals,
      daily: analytics,
    });
  } catch (error: unknown) {
    console.error('[API] Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * GET /api/analytics/daily/:userId/:date
 * Get specific day analytics
 */
router.get('/daily/:userId/:date', async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.params;

    // Parse date
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find user
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get analytics
    const analytics = await prisma.analytics.findFirst({
      where: {
        userId: user.id,
        date: targetDate,
      },
    });

    // Get payments for that day
    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      date: date,
      analytics: analytics || null,
      payments,
      paymentCount: payments.length,
    });
  } catch (error: unknown) {
    console.error('[API] Daily analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch daily analytics' });
  }
});

/**
 * GET /api/analytics/summary/:userId
 * Get summary statistics
 */
router.get('/summary/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // All-time stats
    const allPayments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
    });

    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
    const totalTransactions = allPayments.length;

    // This month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthPayments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        createdAt: {
          gte: monthStart,
        },
      },
    });

    const monthRevenue = monthPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

    // Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todayPayments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        createdAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    });

    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

    res.json({
      userId,
      summary: {
        allTime: {
          totalRevenue,
          totalTransactions,
          avgTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
        },
        month: {
          revenue: monthRevenue,
          transactions: monthPayments.length,
        },
        today: {
          revenue: todayRevenue,
          transactions: todayPayments.length,
        },
      },
    });
  } catch (error: unknown) {
    console.error('[API] Summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export default router;

