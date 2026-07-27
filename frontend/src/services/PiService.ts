/**
 * PiService - Pi Network Authentication Service
 * Handles authentication with Pi Network SDK
 * Properly waits for SDK to load
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
  private isInitializing = false;
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
   * Wait for Pi SDK to be available
   * Polls the window.Pi object until it's ready
   */
  private async waitForPiSDK(maxAttempts: number = 50): Promise<boolean> {
    return new Promise((resolve) => {
      let attempts = 0;

      const checkPi = () => {
        if (window.Pi) {
          console.log('âœ… Pi SDK found in window');
          resolve(true);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkPi, 100);
        } else {
          console.warn('âš ï¸ Pi SDK not found after', maxAttempts * 100, 'ms');
          resolve(false);
        }
      };

      checkPi();
    });
  }

  /**
   * Initialize Pi SDK
   * Must be called before authenticate()
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('â„¹ï¸ Pi SDK already initialized');
      return true;
    }

    if (this.isInitializing) {
      console.log('â„¹ï¸ Pi SDK initialization in progress...');
      // Wait for initialization to complete
      let attempts = 0;
      while (this.isInitializing && attempts < 100) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        attempts++;
      }
      return this.isInitialized;
    }

    this.isInitializing = true;

    try {
      // Wait for Pi SDK to load from script tag
      const piAvailable = await this.waitForPiSDK();

      if (!piAvailable || !window.Pi) {
        console.error('âŒ Pi SDK not available in window object');
        this.isInitializing = false;
        return false;
      }

      console.log('ðŸ”„ Initializing Pi SDK...');

      // Initialize Pi - Pi.init() returns a Promise
      try {
        await window.Pi.init({ version: '2.0', sandbox: false });
        console.log('âœ… Pi SDK successfully initialized');
        this.isInitialized = true;
        this.isInitializing = false;
        return true;
      } catch (initError: any) {
        console.error('âŒ Pi.init() failed:', initError?.message || initError);
        this.isInitializing = false;
        return false;
      }
    } catch (error) {
      console.error('âŒ Error during Pi SDK initialization:', error);
      this.isInitializing = false;
      return false;
    }
  }

  /**
   * Authenticate with Pi Network
   * @param scopes - Data scopes to request
   */
  async authenticate(scopes: string[] = ['username']): Promise<PiAuthResult> {
    try {
      console.log('ðŸ” Starting Pi authentication...');

      // Ensure Pi is initialized first
      const initialized = await this.initialize();
      if (!initialized) {
        console.error('âŒ Pi SDK failed to initialize');
        return {
          success: false,
          error: 'Pi SDK failed to initialize',
        };
      }

      console.log('ðŸ”‘ Requesting authentication...');

      // Authenticate with Pi - handle incomplete payments
      const auth = await window.Pi.authenticate(
        scopes,
        this.onIncompletePaymentFound.bind(this)
      );

      if (!auth) {
        console.error('âŒ No auth object returned');
        return {
          success: false,
          error: 'No auth response from Pi',
        };
      }

      if (!auth.accessToken) {
        console.error('âŒ No access token in auth response');
        return {
          success: false,
          error: 'No access token received from Pi',
        };
      }

      this.user = auth.user;
      console.log(`âœ… Authenticated successfully as: ${auth.user.username}`);

      return {
        success: true,
        accessToken: auth.accessToken,
        user: {
          uid: auth.user.uid,
          username: auth.user.username,
        },
      };
    } catch (error: any) {
      console.error('âŒ Authentication error:', error?.message || error);
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
    console.warn('âš ï¸ Incomplete payment found:', payment.identifier);
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
    console.log('âœ… User logged out');
  }
}

export const piService = PiService.getInstance();
