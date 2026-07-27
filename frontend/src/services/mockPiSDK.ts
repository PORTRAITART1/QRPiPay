/**
 * ðŸ¥§ Mock Pi SDK - DÃ©veloppement local
 * Simule Pi Network SDK pour tests sans Pi Browser
 */

export interface MockPiUser {
  uid: string;
  username: string;
}

export interface MockPiAuthResult {
  user: MockPiUser;
  accessToken: string;
}

export interface MockPiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
  };
}

class MockPiSDK {
  private mockUser: MockPiUser = {
    uid: 'mock_user_' + Math.random().toString(36).substr(2, 9),
    username: 'pioneer_' + Math.random().toString(36).substr(2, 5),
  };

  private mockPayments: Map<string, MockPiPayment> = new Map();

  /**
   * Mock authentification Pi
   */
  async authenticate(): Promise<MockPiAuthResult> {
    console.log('[Mock Pi SDK] Authenticating user...');

    return new Promise((resolve) => {
      setTimeout(() => {
        const result: MockPiAuthResult = {
          user: this.mockUser,
          accessToken: 'mock_token_' + Math.random().toString(36).substr(2, 20),
        };
        console.log('[Mock Pi SDK] âœ… User authenticated:', result.user.username);
        resolve(result);
      }, 1000);
    });
  }

  /**
   * Mock crÃ©ation paiement
   */
  async createPayment(
    amount: number,
    memo: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    console.log('[Mock Pi SDK] Creating payment...', { amount, memo, metadata });

    return new Promise((resolve, reject) => {
      if (amount <= 0) {
        reject(new Error('Amount must be greater than 0'));
        return;
      }

      if (amount > 1000000) {
        reject(new Error('Maximum amount is 1,000,000 Pi'));
        return;
      }

      setTimeout(() => {
        const paymentId = 'mock_payment_' + Math.random().toString(36).substr(2, 20);

        const payment: MockPiPayment = {
          identifier: paymentId,
          user_uid: this.mockUser.uid,
          amount,
          memo,
          status: {
            developer_approved: false,
            transaction_verified: false,
            developer_completed: false,
          },
        };

        this.mockPayments.set(paymentId, payment);

        console.log('[Mock Pi SDK] âœ… Payment created:', paymentId);
        resolve(paymentId);
      }, 500);
    });
  }

  /**
   * Mock approval paiement
   */
  async approvePayment(paymentId: string): Promise<void> {
    console.log('[Mock Pi SDK] Approving payment...', paymentId);

    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = this.mockPayments.get(paymentId);
        if (payment) {
          payment.status.developer_approved = true;
          console.log('[Mock Pi SDK] âœ… Payment approved:', paymentId);
        }
        resolve();
      }, 500);
    });
  }

  /**
   * Mock completion paiement
   */
  async completePayment(paymentId: string): Promise<void> {
    console.log('[Mock Pi SDK] Completing payment...', paymentId);

    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = this.mockPayments.get(paymentId);
        if (payment) {
          payment.status.transaction_verified = true;
          payment.status.developer_completed = true;
          console.log('[Mock Pi SDK] âœ… Payment completed:', paymentId);
        }
        resolve();
      }, 500);
    });
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<MockPiPayment | null> {
    return this.mockPayments.get(paymentId) || null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): MockPiUser {
    return this.mockUser;
  }
}

export const mockPiSDK = new MockPiSDK();
