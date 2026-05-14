/**
 * 📥 Export Routes - CSV exports
 */

import { Router, Request, Response } from 'express';
import { ExportService } from '../services/export';

const router = Router();

/**
 * GET /api/export/payments/:userId
 * Export payments as CSV
 */
router.get('/payments/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const csv = await ExportService.exportPaymentsToCSV(userId);

    // Set headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="qrpipay_payments_${new Date().toISOString().split('T')[0]}.csv"`
    );

    // Send CSV
    res.send(csv);

    console.log('[API] Payments exported for:', userId);
  } catch (error: unknown) {
    console.error('[API] Export payments error:', error);
    res.status(500).json({ error: 'Failed to export payments' });
  }
});

/**
 * GET /api/export/analytics/:userId
 * Export analytics as CSV
 */
router.get('/analytics/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const csv = await ExportService.exportAnalyticsToCSV(userId, days);

    // Set headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="qrpipay_analytics_${new Date().toISOString().split('T')[0]}.csv"`
    );

    // Send CSV
    res.send(csv);

    console.log('[API] Analytics exported for:', userId);
  } catch (error: unknown) {
    console.error('[API] Export analytics error:', error);
    res.status(500).json({ error: 'Failed to export analytics' });
  }
});

export default router;

