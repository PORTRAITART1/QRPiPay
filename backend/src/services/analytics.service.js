const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Analytics Service
 * Handles all analytics and dashboard metrics
 */

class AnalyticsService {
  /**
   * Get dashboard statistics for a user
   */
  async getDashboardStats(userId) {
    try {
      // Get total payments
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const completedPayments = payments.filter(p => p.status === 'completed').length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;

      // Get unique customers
      const uniqueCustomers = new Set(payments.map(p => p.buyerPiUid)).size;

      // Get QR codes
      const qrcodes = await prisma.qrCode.findMany({
        where: { userId }
      });

      return {
        success: true,
        data: {
          totalAmount,
          totalPayments: payments.length,
          completedPayments,
          pendingPayments,
          uniqueCustomers,
          qrCodesGenerated: qrcodes.length,
          successRate: payments.length > 0 
            ? ((completedPayments / payments.length) * 100).toFixed(1)
            : 0
        }
      };
    } catch (error) {
      console.error('❌ getDashboardStats error:', error);
      return {
        success: false,
        error: 'Failed to fetch dashboard stats'
      };
    }
  }

  /**
   * Get payment trends over time
   */
  async getPaymentTrends(userId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const payments = await prisma.payment.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      // Group by date
      const trendsByDate = {};
      payments.forEach(payment => {
        const date = payment.createdAt.toISOString().split('T')[0];
        if (!trendsByDate[date]) {
          trendsByDate[date] = {
            date,
            count: 0,
            amount: 0,
            completed: 0
          };
        }
        trendsByDate[date].count++;
        trendsByDate[date].amount += payment.amount || 0;
        if (payment.status === 'completed') {
          trendsByDate[date].completed++;
        }
      });

      const trends = Object.values(trendsByDate);

      return {
        success: true,
        data: {
          days,
          trends,
          totalPayments: payments.length,
          totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0)
        }
      };
    } catch (error) {
      console.error('❌ getPaymentTrends error:', error);
      return {
        success: false,
        error: 'Failed to fetch payment trends'
      };
    }
  }

  /**
   * Get daily summary
   */
  async getDailySummary(userId, date) {
    try {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const payments = await prisma.payment.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        }
      });

      return {
        success: true,
        data: {
          date,
          totalPayments: payments.length,
          totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
          completedPayments: payments.filter(p => p.status === 'completed').length,
          pendingPayments: payments.filter(p => p.status === 'pending').length,
          failedPayments: payments.filter(p => p.status === 'failed').length
        }
      };
    } catch (error) {
      console.error('❌ getDailySummary error:', error);
      return {
        success: false,
        error: 'Failed to fetch daily summary'
      };
    }
  }

  /**
   * Get user summary
   */
  async getUserSummary(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const payments = await prisma.payment.findMany({
        where: { userId }
      });

      const qrcodes = await prisma.qrCode.findMany({
        where: { userId }
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            piAddress: user.piAddress,
            username: user.username,
            verified: user.verified
          },
          stats: {
            totalPayments: payments.length,
            totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
            qrCodesGenerated: qrcodes.length,
            successRate: payments.length > 0
              ? ((payments.filter(p => p.status === 'completed').length / payments.length) * 100).toFixed(1)
              : 0
          }
        }
      };
    } catch (error) {
      console.error('❌ getUserSummary error:', error);
      return {
        success: false,
        error: 'Failed to fetch user summary'
      };
    }
  }
}

module.exports = new AnalyticsService();
