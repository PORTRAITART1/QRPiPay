/**
 * 🏪 Auth Store - Zustand
 * Global state management pour authentification
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockPiSDK, MockPiUser } from '../services/mockPiSDK';

interface AuthState {
  user: MockPiUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  authenticate: () => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      authenticate: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await mockPiSDK.authenticate();
          set({
            user: result.user,
            accessToken: result.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Authentication failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'qrpipay-auth',
    }
  )
);
