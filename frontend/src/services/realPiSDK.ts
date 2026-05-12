/**
 * 🥧 Real Pi SDK Service - Production Integration
 * Remplace Mock SDK pour production
 */

declare global {
  interface Window {
    Pi: any;
  }
}

export interface PiUser {
  uid: string;
  username: string;
}

export interface PiAuthResult {
  user: PiUser;
  accessToken: string;
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  from_address: string;
  to_address: string;
  direction: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

class RealPiSDK {
  private static instance: RealPiSDK;
  private readonly apiKey: string;
  private readonly apiUrl: string = 'https://api.minepi.com/v2';
  private accessToken: string | null = null;
  private currentUser: PiUser | null = null;

  private constructor() {
    this.apiKey = process.env.VITE_PI_API_KEY || '';
    
    // Check if running in Pi Browser
    if (!window.Pi) {
      console.warn('[Pi SDK] Not running in Pi Browser');
    }
  }

  static getInstance(): RealPiSDK {
    if (!RealPiSDK.instance) {
      RealPiSDK.instance = new RealPiSDK();
    }
    return RealPiSDK.instance;
  }

  /**
   * ÉTAPE 1: Authentification Pi Network
   * Récupère l'utilisateur et le token d'accès
   */
  async authenticate(): Promise<PiAuthResult> {
    try {
      if (!window.Pi) {
        throw new Error('Cette application nécessite Pi Browser');
      }

      console.log('[Pi SDK] Starting authentication...');

      // Scopes requis par Pi Network
      const scopes = ['username', 'payments'];

      // Authentification Pi
      const authResult = await window.Pi.authenticate(scopes, this.onIncompletePaymentFound.bind(this));

      this.currentUser = authResult.user;
      this.accessToken = authResult.accessToken;

      console.log('[Pi SDK] ✅ User authenticated:', authResult.user.username);

      // IMPORTANT: Valider le token sur le backend
      await this.verifyAccessTokenOnBackend(authResult.accessToken);

      return {
        user: authResult.user,
        accessToken: authResult.accessToken,
      };
    } catch (error) {
      console.error('[Pi SDK] Authentication error:', error);
      throw new Error('Authentification Pi échouée');
    }
  }

  /**
   * ÉTAPE 2: Créer un paiement
   * Prépare la transaction Pi
   */
  async createPayment(
    amount: number,
    memo: string,
    metadata: Record<string, any> = {}
  ): Promise<string> {
    try {
      if (!this.currentUser || !this.accessToken) {
        throw new Error('User not authenticated');
      }

      console.log('[Pi SDK] Creating payment...', { amount, memo });

      // Validation montant
      if (amount <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }

      if (amount > 1000000) {
        throw new Error('Le montant maximum est 1,000,000 Pi');
      }

      return new Promise((resolve, reject) => {
        // Créer le paiement via Pi SDK
        const payment = window.Pi.createPayment(
          {
            amount,
            memo,
            metadata: {
              ...metadata,
              appName: 'QRPiPay',
              appVersion: '1.0.0',
              timestamp: new Date().toISOString(),
              userUid: this.currentUser?.uid,
            },
          },
          {
            // CALLBACK 1: Payment ready for server approval
            onReadyForServerApproval: async (paymentId: string) => {
              console.log('[Pi SDK] Payment ready for approval:', paymentId);

              try {
                // Backend approval
                await this.approvePaymentOnBackend(paymentId);
                console.log('[Pi SDK] ✅ Server approved payment:', paymentId);
              } catch (error) {
                console.error('[Pi SDK] Server approval failed:', error);
                reject(error);
              }
            },

            // CALLBACK 2: Payment ready for server completion
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              console.log('[Pi SDK] Payment ready for completion:', paymentId, 'TxID:', txid);

              try {
                // Backend completion
                await this.completePaymentOnBackend(paymentId, txid);
                console.log('[Pi SDK] ✅ Payment completed:', paymentId);
                resolve(paymentId);
              } catch (error) {
                console.error('[Pi SDK] Server completion failed:', error);
                reject(error);
              }
            },

            // CALLBACK 3: Payment cancelled
            onCancel: (paymentId: string) => {
              console.log('[Pi SDK] Payment cancelled:', paymentId);
              reject(new Error('Paiement annulé par l\'utilisateur'));
            },

            // CALLBACK 4: Error occurred
            onError: (error: any, payment: any) => {
              console.error('[Pi SDK] Payment error:', error, payment);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error('[Pi SDK] Create payment error:', error);
      throw error;
    }
  }

  /**
   * Backend: Approuve le paiement
   */
  private async approvePaymentOnBackend(paymentId: string): Promise<void> {
    const response = await fetch('/api/payments/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) {
      throw new Error('Server approval failed');
    }
  }

  /**
   * Backend: Complète le paiement
   */
  private async completePaymentOnBackend(paymentId: string, txid: string): Promise<void> {
    const response = await fetch('/api/payments/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ paymentId, txid }),
    });

    if (!response.ok) {
      throw new Error('Server completion failed');
    }
  }

  /**
   * Vérifier le token d'accès sur le backend
   */
  private async verifyAccessTokenOnBackend(accessToken: string): Promise<void> {
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid Pi access token');
    }
  }

  /**
   * Gestion des paiements incomplets
   * Important: Appeler lors de l'initialisation de l'app
   */
  private onIncompletePaymentFound(payment: PiPayment): void {
    console.log('[Pi SDK] Incomplete payment found:', payment);

    // Si le paiement a été approuvé mais pas complété
    if (payment.status.developer_approved && !payment.status.developer_completed && payment.transaction?.txid) {
      this.completePaymentOnBackend(payment.identifier, payment.transaction.txid)
        .then(() => console.log('[Pi SDK] Incomplete payment recovered'))
        .catch((error) => console.error('[Pi SDK] Failed to recover payment:', error));
    }
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser(): PiUser | null {
    return this.currentUser;
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.currentUser = null;
    this.accessToken = null;
  }
}

// Export singleton
export const realPiSDK = RealPiSDK.getInstance();
