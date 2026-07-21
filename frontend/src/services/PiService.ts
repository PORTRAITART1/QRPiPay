/**
 * PiService - Pi Network Authentication Service
 * Handles authentication with Pi Network SDK
 */

declare global {
  interface Window {
    Pi: any;
  }
}

export interface PiAuthResult {
  success: boolean;
  accessToken?: string;
  user?: {
    uid: string;
    username: string;
  };
  error?: string;
}

export class PiService {
  private static instance: PiService;
  private isInitialized = false;
  private user: any = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): PiService {
    if (!PiService.instance) {
      PiService.instance = new PiService();
    }
    return PiService.instance;
  }

  /**
   * Initialize Pi SDK
   * Must be called before authenticate()
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      if (!window.Pi) {
        console.warn('Pi SDK not loaded in window');
        return false;
      }

      // Initialize Pi as a Promise
      await new Promise((resolve, reject) => {
        window.Pi.init({ version: '2.0', sandbox: false })
          .then(() => {
            console.log('✅ Pi SDK initialized');
            this.isInitialized = true;
            resolve(true);
          })
          .catch((error: any) => {
            console.error('❌ Pi SDK initialization failed:', error);
            reject(error);
          });
      });

      return this.isInitialized;
    } catch (error) {
      console.error('Error initializing Pi SDK:', error);
      return false;
    }
  }

  /**
   * Authenticate with Pi Network
   * @param scopes - Data scopes to request
   */
  async authenticate(scopes: string[] = ['username']): Promise<PiAuthResult> {
    try {
      // Ensure Pi is initialized first
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'Pi SDK failed to initialize',
        };
      }

      // Authenticate with Pi
      const auth = await window.Pi.authenticate(scopes, this.onIncompletePaymentFound.bind(this));

      if (!auth || !auth.accessToken) {
        return {
          success: false,
          error: 'No access token received from Pi',
        };
      }

      this.user = auth.user;
      console.log(`✅ Authenticated as ${auth.user.username}`);

      return {
        success: true,
        accessToken: auth.accessToken,
        user: {
          uid: auth.user.uid,
          username: auth.user.username,
        },
      };
    } catch (error: any) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error?.message || 'Authentication failed',
      };
    }
  }

  /**
   * Callback for incomplete payments
   */
  private onIncompletePaymentFound(payment: any) {
    console.warn('⚠️ Incomplete payment found:', payment.identifier);
    // Handle incomplete payment logic on backend
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.user;
  }

  /**
   * Logout
   */
  logout() {
    this.user = null;
    this.isInitialized = false;
  }
}

export const piService = PiService.getInstance();
