/**
 * 🌐 API Client - Communication avec backend
 */

import axios, { AxiosInstance } from 'axios';

interface ApiPayment {
  id: string;
  userId: string;
  amount: number;
  memo: string;
  status: 'pending' | 'approved' | 'completed' | 'failed';
  createdAt: string;
  txid?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create payment
   */
  async createPayment(
    amount: number,
    memo: string,
    userId: string
  ): Promise<{ paymentId: string; payment: ApiPayment }> {
    const response = await this.client.post('/payments', {
      amount,
      memo,
      userId,
    });
    return response.data;
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<ApiPayment> {
    const response = await this.client.get(`/payments/${paymentId}`);
    return response.data;
  }

  /**
   * Approve payment
   */
  async approvePayment(paymentId: string): Promise<{ success: boolean; payment: ApiPayment }> {
    const response = await this.client.post(`/payments/${paymentId}/approve`);
    return response.data;
  }

  /**
   * Complete payment
   */
  async completePayment(
    paymentId: string,
    txid: string
  ): Promise<{ success: boolean; payment: ApiPayment }> {
    const response = await this.client.post(`/payments/${paymentId}/complete`, {
      paymentId,
      txid,
    });
    return response.data;
  }

  /**
   * Get user payments
   */
  async getUserPayments(userId: string): Promise<{ userId: string; count: number; payments: ApiPayment[] }> {
    const response = await this.client.get(`/payments/user/${userId}`);
    return response.data;
  }

  /**
   * Get all payments (admin)
   */
  async getAllPayments(): Promise<{ total: number; payments: ApiPayment[] }> {
    const response = await this.client.get('/payments');
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const baseUrl = this.client.defaults.baseURL || '';
    const healthUrl = baseUrl.replace('/api', '') + '/health';
    const response = await axios.get(healthUrl);
    return response.data;
  }
}

export const apiClient = new ApiClient(
  process.env.VITE_API_URL || 'http://localhost:3001/api'
);
