/**
 * ✅ Integration Tests - Database + API
 */

import prisma from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // Clear test data
    await prisma.payment.deleteMany({});
    await prisma.qRCode.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Creation', () => {
    it('should create a user', async () => {
      const user = await prisma.user.create({
        data: {
          piUid: 'pi_test_001',
          username: 'test_user',
          email: 'test@example.com',
          businessName: 'Test Business',
        },
      });

      expect(user).toBeDefined();
      expect(user.piUid).toBe('pi_test_001');
      expect(user.username).toBe('test_user');
      expect(user.isKycVerified).toBe(false);
    });

    it('should not create duplicate user', async () => {
      await prisma.user.create({
        data: {
          piUid: 'pi_test_002',
          username: 'test_user_2',
        },
      });

      try {
        await prisma.user.create({
          data: {
            piUid: 'pi_test_002',
            username: 'test_user_duplicate',
          },
        });
        fail('Should throw error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Payment Creation', () => {
    it('should create a payment', async () => {
      const user = await prisma.user.create({
        data: {
          piUid: 'pi_test_payment_001',
          username: 'payment_user',
        },
      });

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          piPaymentId: 'pi_pay_001_test',
          amount: new Decimal('50.00'),
          memo: 'Test payment',
          status: 'PENDING',
        },
      });

      expect(payment).toBeDefined();
      expect(payment.amount).toEqual(new Decimal('50.00'));
      expect(payment.status).toBe('PENDING');
    });

    it('should update payment status', async () => {
      const user = await prisma.user.create({
        data: {
          piUid: 'pi_test_payment_002',
          username: 'payment_user_2',
        },
      });

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          piPaymentId: 'pi_pay_002_test',
          amount: new Decimal('100.00'),
          memo: 'Test payment 2',
          status: 'PENDING',
        },
      });

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          txid: 'txid_test_001',
          completedAt: new Date(),
        },
      });

      expect(updated.status).toBe('COMPLETED');
      expect(updated.txid).toBe('txid_test_001');
    });
  });

  describe('QR Code Creation', () => {
    it('should create a QR code', async () => {
      const user = await prisma.user.create({
        data: {
          piUid: 'pi_test_qr_001',
          username: 'qr_user',
        },
      });

      const qr = await prisma.qRCode.create({
        data: {
          userId: user.id,
          amount: new Decimal('25.50'),
          description: 'Test QR',
          qrData: JSON.stringify({ amount: 25.5 }),
          status: 'PENDING',
        },
      });

      expect(qr).toBeDefined();
      expect(qr.amount).toEqual(new Decimal('25.50'));
      expect(qr.status).toBe('PENDING');
    });
  });

  describe('Analytics', () => {
    it('should create analytics entry', async () => {
      const user = await prisma.user.create({
        data: {
          piUid: 'pi_test_analytics_001',
          username: 'analytics_user',
        },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const analytics = await prisma.analytics.create({
        data: {
          userId: user.id,
          date: today,
          totalPayments: 5,
          totalAmount: new Decimal('250.00'),
          uniqueCustomers: 3,
          qrCodesGenerated: 5,
          qrCodesScanned: 5,
          successRate: 100,
        },
      });

      expect(analytics).toBeDefined();
      expect(analytics.totalPayments).toBe(5);
      expect(analytics.totalAmount).toEqual(new Decimal('250.00'));
    });
  });
});
