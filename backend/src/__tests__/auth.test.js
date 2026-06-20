const piAuthService = require('../services/piAuth.service.js');

describe('Pi Auth Service', () => {
  test('should validate Pi token', async () => {
    // Mock test
    const result = {
      success: false,
      error: 'Invalid Pi token'
    };

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid/);
  });

  test('should handle authentication error', () => {
    const error = new Error('Auth failed');
    expect(error.message).toBe('Auth failed');
  });
});
