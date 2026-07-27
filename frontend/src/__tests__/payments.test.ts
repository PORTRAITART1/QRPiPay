/**
 * âœ… Test - Payment Functionality
 */

import { mockPiSDK } from '../services/mockPiSDK';

describe('Payment Functionality', () => {
  it('should create payment with valid amount', async () => {
    const paymentId = await mockPiSDK.createPayment(
      10.5,
      'Test payment',
      {}
    );

    expect(paymentId).toBeDefined();
    expect(typeof paymentId).toBe('string');
    expect(paymentId).toMatch(/^mock_payment_/);
  });

  it('should reject payment with invalid amount (zero)', async () => {
    try {
      await mockPiSDK.createPayment(0, 'Invalid', {});
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should reject payment with invalid amount (negative)', async () => {
    try {
      await mockPiSDK.createPayment(-5, 'Invalid', {});
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should reject payment exceeding max amount', async () => {
    try {
      await mockPiSDK.createPayment(2000000, 'Too much', {});
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should approve payment', async () => {
    const paymentId = await mockPiSDK.createPayment(50, 'Test', {});
    await mockPiSDK.approvePayment(paymentId);

    const payment = await mockPiSDK.getPaymentStatus(paymentId);
    expect(payment?.status.developer_approved).toBe(true);
  });

  it('should complete payment', async () => {
    const paymentId = await mockPiSDK.createPayment(100, 'Test', {});
    await mockPiSDK.approvePayment(paymentId);
    await mockPiSDK.completePayment(paymentId);

    const payment = await mockPiSDK.getPaymentStatus(paymentId);
    expect(payment?.status.developer_completed).toBe(true);
  });

  it('should get current user', () => {
    const user = mockPiSDK.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.uid).toBeDefined();
    expect(user.username).toBeDefined();
  });
});
