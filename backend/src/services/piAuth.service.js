const axios = require('axios');

class PiAuthService {
  async validateAccessToken(accessToken) {
    try {
      const response = await axios.get('https://api.minepi.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('❌ Pi token validation error:', error.message);
      return {
        success: false,
        error: 'Invalid Pi token'
      };
    }
  }
}

module.exports = new PiAuthService();
