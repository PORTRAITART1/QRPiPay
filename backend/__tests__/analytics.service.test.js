/**
 * Backend Unit Tests - Analytics Service
 * Jest tests for analytics functionality
 */

const analyticsService = require('../services/analytics.service');
const { PrismaClient } = require('@prisma/client');

// Mock Prisma
jest.mock('@prisma/client');

describe('Analytics Service', () => {
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      payment: {
        findMany: jest.fn()
      },
      qrCode: {
        findMany: jest.fn()
      }
    };
    PrismaClient.mockImplementation(() => mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      // Mock data
      const mockPayments = [
        { id: '1', amount: 100, status: 'completed', buyerPiUid: 'user1' },
        { id: '2', amount: 50, status: 'completed', buyerPiUid: 'user2' },
        { id: '3', amount: 25, status: 'pending', buyerPiUid: 'user1' }
      ];

      const mockQRCodes = [
        { id: 'qr1', userId: 'user123' },
        { id: 'qr2', userId: 'user123' }
      ];

      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);
      mockPrisma.qrCode.findMany.mockResolvedValue(mockQRCodes);

      // Execute
      const result = await analyticsService.getDashboardStats('user123');

      // Verify
      expect(result.success).toBe(true);
      expect(result.data.totalAmount).toBe(175);
      expect(result.data.totalPayments).toBe(3);
      expect(result.data.completedPayments).toBe(2);
      expect(result.data.successRate).toBe('66.7');
      expect(result.data.qrCodesGenerated).toBe(2);
    });

    it('should handle empty payments', async () => {
      mockPrisma.payment.findMany.mockResolvedValue([]);
      mockPrisma.qrCode.findMany.mockResolvedValue([]);

      const result = await analyticsService.getDashboardStats('user123');

      expect(result.success).toBe(true);
      expect(result.data.totalPayments).toBe(0);
      expect(result.data.successRate).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      mockPrisma.payment.findMany.mockRejectedValue(new Error('DB Error'));

      const result = await analyticsService.getDashboardStats('user123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getPaymentTrends', () => {
    it('should return payment trends', async () => {
      const mockPayments = [
        {
          id: '1',
          amount: 100,
          status: 'completed',
          createdAt: new Date('2024-01-19')
        },
        {
          id: '2',
          amount: 50,
          status: 'completed',
          createdAt: new Date('2024-01-19')
        },
        {
          id: '3',
          amount: 75,
          status: 'completed',
          createdAt: new Date('2024-01-20')
        }
      ];

      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await analyticsService.getPaymentTrends('user123', 7);

      expect(result.success).toBe(true);
      expect(result.data.trends).toBeDefined();
      expect(result.data.trends.length).toBeGreaterThan(0);
      expect(result.data.totalPayments).toBe(3);
    });

    it('should group payments by date', async () => {
      const mockPayments = [
        {
          amount: 100,
          status: 'completed',
          createdAt: new Date('2024-01-19T10:00:00')
        },
        {
          amount: 50,
          status: 'completed',
          createdAt: new Date('2024-01-19T14:00:00')
        }
      ];

      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await analyticsService.getPaymentTrends('user123', 7);

      expect(result.success).toBe(true);
      // Should have 1 entry for 2024-01-19 with combined data
      expect(result.data.trends.length).toBe(1);
      expect(result.data.trends[0].count).toBe(2);
      expect(result.data.trends[0].amount).toBe(150);
    });
  });

  describe('getDailySummary', () => {
    it('should return summary for specific date', async () => {
      const mockPayments = [
        { amount: 100, status: 'completed' },
        { amount: 50, status: 'completed' },
        { amount: 25, status: 'pending' }
      ];

      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await analyticsService.getDailySummary(
        'user123',
        '2024-01-19'
      );

      expect(result.success).toBe(true);
      expect(result.data.totalPayments).toBe(3);
      expect(result.data.totalAmount).toBe(175);
      expect(result.data.completedPayments).toBe(2);
    });
  });

  describe('getUserSummary', () => {
    it('should return user summary', async () => {
      const mockUser = {
        id: 'user123',
        piAddress: 'pi_address_123',
        username: 'testuser',
        verified: true
      };

      const mockPayments = [
        { amount: 100, status: 'completed' },
        { amount: 50, status: 'completed' }
      ];

      const mockQRCodes = [{ id: 'qr1' }, { id: 'qr2' }];

      // Note: This would need proper mocking of user lookup
      // Simplified for example

      expect(result.success).toBe(true);
      expect(result.data.stats.totalPayments).toBe(2);
      expect(result.data.stats.qrCodesGenerated).toBe(2);
    });
  });
});
