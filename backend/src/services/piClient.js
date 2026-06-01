const axios = require('axios');

class PiNetworkClient {
  constructor(apiKey, appId) {
    this.apiKey = apiKey;
    this.appId = appId;
    this.apiUrl = process.env.PI_API_URL || 'https://api.minepi.com';
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async verifyUser(piAddress, signature) {
    try {
      const response = await this.client.post('/v2/authenticate', {
        address: piAddress,
        signature: signature
      });
      return response.data;
    } catch (error) {
      console.error('Pi auth error:', error);
      throw error;
    }
  }

  async createPayment(piAddress, amount, description) {
    try {
      const response = await this.client.post('/v2/payments', {
        amount: amount,
        currency: 'Pi',
        user_address: piAddress,
        description: description,
        app_id: this.appId
      });
      return response.data;
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await this.client.get(`/v2/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Payment status error:', error);
      throw error;
    }
  }
}

module.exports = PiNetworkClient;
