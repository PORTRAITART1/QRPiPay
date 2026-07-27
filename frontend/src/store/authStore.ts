/**
 * ðŸª Auth Store - Zustand
 * Global state management pour authentification Pi Network
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { piService } from '../services/PiService';

export interface AuthUser {
  uid: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  authenticate: () => Promise<void>;
  validateToken: (accessToken: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Authenticate with Pi Network
       */
      authenticate: async () => {
        set({ isLoading: true, error: null });
        try {
          // Authenticate with Pi Network
          const piResult = await piService.authenticate(['username']);

          if (!piResult.success || !piResult.accessToken || !piResult.user) {
            throw new Error(piResult.error || 'Authentication failed');
          }

          // Validate token on backend
          const isValid = await get().validateToken(piResult.accessToken);

          if (!isValid) {
            throw new Error('Token validation failed');
          }

          // Set authenticated state
          set({
            user: piResult.user,
            accessToken: piResult.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log(`âœ… Successfully authenticated as ${piResult.user.username}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          console.error('âŒ Authentication error:', errorMessage);
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Validate access token on backend
       */
      validateToken: async (accessToken: string): Promise<boolean> => {
        try {
          const response = await fetch('/api/auth/validate-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
          });

          if (!response.ok) {
            console.error('âŒ Token validation failed:', response.statusText);
            return false;
          }

          const data = await response.json();
          console.log('âœ… Token validated successfully');
          return data.valid === true;
        } catch (error) {
          console.error('âŒ Token validation error:', error);
          return false;
        }
      },

      /**
       * Logout
       */
      logout: () => {
        piService.logout();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
        console.log('âœ… Logged out');
      },

      /**
       * Set error message
       */
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'qrpipay-auth',
    }
  )
);
