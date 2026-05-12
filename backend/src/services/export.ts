/**
 * 📥 Export Service - CSV generation
 */

import prisma from '../lib/prisma';
import { Readable } from 'stream';

export class ExportService {
  /**
   * Export payments to CSV
   */
  static async exportPaymentsToCSV(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { qrCode: true },
    });

    // CSV header
    const headers = [
      'Payment ID',
      'Date',
      'Amount (Pi)',
      'Description',
      'Status',
      'Buyer',
      'Transaction ID',
      'Created At',
      'Completed At',
    ];

    // CSV rows
    const rows = payments.map((payment) => [
      payment.id,
      payment.createdAt.toLocaleDateString('fr-FR'),
      payment.amount.toString(),
      payment.memo,
      payment.status,
      payment.buyerUsername || 'N/A',
      payment.txid || 'N/A',
      payment.createdAt.toLocaleString('fr-FR'),
      payment.completedAt ? payment.completedAt.toLocaleString('fr-FR') : 'N/A',
    ]);

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell))
          .join(',')
      ),
    ].join('\n');

    return csv;
  }

  /**
   * Export analytics to CSV
   */
  static async exportAnalyticsToCSV(userId: string, days: number = 30): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { piUid: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await prisma.analytics.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // CSV header
    const headers = [
      'Date',
      'Total Payments',
      'Total Amount (Pi)',
      'Unique Customers',
      'QR Codes Generated',
      'QR Codes Scanned',
      'Success Rate (%)',
    ];

    // CSV rows
    const rows = analytics.map((item) => [
      item.date.toLocaleDateString('fr-FR'),
      item.totalPayments.toString(),
      item.totalAmount.toString(),
      item.uniqueCustomers.toString(),
      item.qrCodesGenerated.toString(),
      item.qrCodesScanned.toString(),
      item.successRate.toFixed(2),
    ]);

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Create readable stream for CSV
   */
  static createCsvStream(csv: string): Readable {
    const stream = new Readable();
    stream.push(csv);
    stream.push(null);
    return stream;
  }
}
