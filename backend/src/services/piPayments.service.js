const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PiPaymentsService {
  async createPayment(userId, amount, description) {
    try {
      // Crée le paiement en base
      const payment = await prisma.payment.create({
        data: {
          userId: userId,
          amount: amount,
          currency: 'Pi',
          status: 'pending',
          description: description || 'QRPiPay Payment'
        }
      });

      console.log('✅ Payment created:', payment.id);
      return {
        success: true,
        paymentId: payment.id,
        amount: amount
      };
    } catch (error) {
      console.error('❌ Payment creation error:', error);
      return {
        success: false,
        error: 'Failed to create payment'
      };
    }
  }

  async completePayment(paymentId, txHash) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'completed',
          txHash: txHash
        }
      });

      console.log('✅ Payment completed:', paymentId);
      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('❌ Payment completion error:', error);
      return {
        success: false,
        error: 'Failed to complete payment'
      };
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      return { success: false, error: 'Failed to get payment status' };
    }
  }
}

module.exports = new PiPaymentsService();
